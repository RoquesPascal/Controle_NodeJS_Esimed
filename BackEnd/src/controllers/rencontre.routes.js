const express = require('express');
const { body, validationResult} = require('express-validator');
const router = express.Router();
const uuid = require('uuid');
const Table_Rencontres = require("../models/rencontre.model");
const jwtDecode = require("jwt-decode");
const Table_RelationCreationUtilisateurPersonnesARencontrer = require("../models/relation-creation-utilisateur-personne-a-rencontrer.model");



router.get('/',
           async (req, res) =>
{
    try
    {
        const toutesLesrencontres = await Table_Rencontres.findAll({order: [['createdAt', 'DESC']]});
        return res.status(200).send(toutesLesrencontres);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération des personnes");
    }
});

router.get('/:idRencontre',
           async (req, res) =>
{
    try
    {
        const rencontre = await Table_Rencontres.findOne({
            where :
            {
                id : req.params.idRencontre
            }
        });
        return res.status(200).send(rencontre);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération de la rencontre");
    }
});

router.get('/idUtilisateur/:idUtilisateur',
    async (req, res) =>
{
    try
    {
        const rencontre = await Table_Rencontres.findAll({
            where :
                {
                    idUtilisateur : req.params.idUtilisateur
                },
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).send(rencontre);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération de la personne");
    }
});

router.get('/listeRencontreDePersonneARencontrer/:idPersonne',
    async (req, res) =>
    {
        try
        {
            const tokenDecode = jwtDecode(req.headers.authorization);
            const relationUtilisateurPersonnes = await Table_RelationCreationUtilisateurPersonnesARencontrer.findOne({
                where :
                {
                    idUtilisateur        : tokenDecode.id,
                    idPersonneRencontree : req.params.idPersonne
                }
            });
            if(relationUtilisateurPersonnes.id == null)
                res.status(403).send("Vous n'avez pas le droit d'acceder a cette ressource.");


            let listeRencontres = await Table_Rencontres.findAll({
                where :
                {
                    idPersonneRencontree : req.params.idPersonne,
                    partage              : true
                },
                order: [['createdAt', 'DESC']]
            });

            function EstRencontreDejaFaite(rencontre)
            {
                const dateActuelle = new Date(Date.now());
                const dateDeLaRencontre = rencontre.dateRencontre.toString(); //Car les GetDate() et tout ne fonctionnent pas

                if(dateActuelle.getFullYear() > parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])) //Année actuelle > année rencontre
                    return true;
                else if(dateActuelle.getFullYear() < parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])) //Année actuelle < année rencontre
                    return false;
                else
                {
                    if(dateActuelle.getMonth() + 1 > parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])) //Mois actuel > mois rencontre
                        return true;
                    else if(dateActuelle.getMonth() + 1 < parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])) //Mois actuel < mois rencontre
                        return false;
                    else
                    {
                        if(dateActuelle.getDate() >= parseInt(dateDeLaRencontre[8] + dateDeLaRencontre[9])) //Jour actuel >= jour rencontre
                            return true;
                        else //Jour actuel < jour rencontre
                            return false;
                    }
                }
            }

            for(let i = 0 ; i < listeRencontres.length ; i++)
            {
                if(!EstRencontreDejaFaite(listeRencontres[i]))
                    listeRencontres.splice(i, 1);
            }

            return res.status(200).send(listeRencontres);
        }
        catch(e)
        {
            return res.status(400).send("Erreur lors de la récupération de la personne");
        }
    });

router.post('/rencontresCommunes/utilisateurPersonne',
            body('idUtilisateur').isString().notEmpty(),
            body('idPersonneRencontree').isString().notEmpty(),
           async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        const rencontres = await Table_Rencontres.findOne({
            where :
            {
                idUtilisateur : req.body.idUtilisateur,
                idPersonneRencontree : req.body.idPersonneRencontree
            }
        });
        return res.status(200).send(rencontres);
    }
    catch(e)
    {
        return res.status(400).send("Il n'y a pas de rencontres disponibles");
    }
});

router.post('/',
            body('idPersonneRencontree').isString().notEmpty(),
            body('dateRencontreJour').isInt().notEmpty(),
            body('dateRencontreMois').isInt().notEmpty(),
            body('dateRencontreAnnee').isInt().notEmpty(),
            body('note').isInt(),
            body('partage').isBoolean().notEmpty(),
            async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        let dateDeLaRencontre = new Date(req.body.dateRencontreAnnee, req.body.dateRencontreMois - 1, req.body.dateRencontreJour);
        const tokenDecode = jwtDecode(req.headers.authorization);
        await Table_Rencontres.create({id                   : uuid.v4(),
                                             idUtilisateur        : tokenDecode.id,
                                             idPersonneRencontree : req.body.idPersonneRencontree,
                                             dateRencontre        : dateDeLaRencontre,
                                             note                 : req.body.note,
                                             commentaire          : req.body.commentaire,
                                             partage              : req.body.partage});
        res.status(201).send("Rencontre Ajoutée !");
    }
    catch(e)
    {
        res.status(400).send("Erreur lors de l'ajout de la rencontre");
    }
});

router.put('/',
           body('idRencontre').isString().notEmpty(),
           body('dateRencontreJour').isInt().notEmpty(),
           body('dateRencontreMois').isInt().notEmpty(),
           body('dateRencontreAnnee').isInt().notEmpty(),
           body('note').isInt(),
           body('partage').isInt().notEmpty(),
           async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        const dateDeLaRencontre = new Date(req.body.dateRencontreAnnee, req.body.dateRencontreMois - 1, req.body.dateRencontreJour);
        const partagerLeCommentaire = (req.body.partage == 1);
        await Table_Rencontres.update(
            {
                dateRencontre : dateDeLaRencontre,
                note          : req.body.note,
                commentaire   : req.body.commentaire,
                partage       : partagerLeCommentaire
            }, {
            where :
            {
                id : req.body.idRencontre
            }
        });
        res.status(200).send("Rencontre modifiée !");
    }
    catch(e)
    {
        res.status(400).send("Erreur lors de la modification de la rencontre");
    }
});

router.delete('/',
              body('idRencontre').isString().notEmpty(),
              async (req, res) =>
{
    try
    {
        await Table_Rencontres.destroy({
            where :
                {
                    id : req.body.idRencontre
                }
        })
        res.status(200).send("Rencontre Supprimée !");
    }
    catch(e)
    {
        res.status(400).send("Erreur lors de la suppression de la rencontre");
    }
});

exports.initializeRoutes = () => router;
