const express = require('express');
const { body, validationResult} = require('express-validator');
const router = express.Router();
const uuid = require('uuid');
const Table_Rencontres = require("../models/rencontre.model");
const Table_PersonnesARencontrer = require("../models/personnes-a-rencontrer.model");
const Table_RelationCreationUtilisateurPersonnesARencontrer = require("../models/relation-creation-utilisateur-personne-a-rencontrer.model");
const Table_Images = require("../models/image.model");
const jwtDecode = require("jwt-decode");
const {EstRole_moderateur, TrierPersonnesParNomPuisPrenom, SupprimerFichierImagePersonneARencontrer, EstPersonneMajeure} = require("../fonctions-back-end/fonctions-back-end");



router.get('/',
           async (req, res) =>
{
    try
    {
        const tokenDecode = jwtDecode(req.headers.authorization);
        const relationsUtilisateurPersonnes = await Table_RelationCreationUtilisateurPersonnesARencontrer.findAll({
            where :
            {
                idUtilisateur : tokenDecode.id
            }
        });
        let listePersonnes = [];
        for(const personne of relationsUtilisateurPersonnes)
        {
            const laPersonne = await Table_PersonnesARencontrer.findOne({
                where :
                {
                    id : personne.idPersonneRencontree
                }
            });
            listePersonnes.push(laPersonne);
        }
        listePersonnes = TrierPersonnesParNomPuisPrenom(listePersonnes);

        return res.status(200).send(listePersonnes);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération des personnes");
    }
});

router.get('/:id',
           async (req, res) =>
{
    try
    {
        const tokenDecode = jwtDecode(req.headers.authorization);
        const estModerateur = EstRole_moderateur(tokenDecode);

        const relationUtilisateurPersonnes = await Table_RelationCreationUtilisateurPersonnesARencontrer.findOne({
            where :
            {
                idUtilisateur        : tokenDecode.id,
                idPersonneRencontree : req.params.id
            }
        });

        if(!estModerateur && ((relationUtilisateurPersonnes == null) || (relationUtilisateurPersonnes.id == null)))
            return res.status(403).send(`Vous n'avez pas le droit d'acceder a cette ressource.`);

        const personne = await Table_PersonnesARencontrer.findOne({
            where :
            {
                id : req.params.id
            }
        });
        return res.status(200).send(personne);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération de la personne");
    }
});

router.post('/',
            body('nom').isString().notEmpty(),
            body('prenom').isString().notEmpty(),
            body('sexe').isInt().notEmpty(),
            body('dateNaissanceJour').isInt().notEmpty(),
            body('dateNaissanceMois').isInt().notEmpty(),
            body('dateNaissanceAnnee').isInt().notEmpty(),
            async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        const tokenDecode = jwtDecode(req.headers.authorization);

        let personne = await Table_PersonnesARencontrer.findOne({
            where :
            {
                nom    : req.body.nom,
                prenom : req.body.prenom,
                sexe   : req.body.sexe
            }
        });

        if(personne == null) //Si la personne n'existe pas
        {
            const dateDeNaissance = new Date(req.body.dateNaissanceAnnee, req.body.dateNaissanceMois - 1, req.body.dateNaissanceJour);

            if(!EstPersonneMajeure(dateDeNaissance))
                return res.status(400).send("La personne n'est pas majeure");

            const idPersonne = uuid.v4();
            personne = await Table_PersonnesARencontrer.create({id            : idPersonne,
                                                           nom           : req.body.nom,
                                                           prenom        : req.body.prenom,
                                                           sexe          : req.body.sexe,
                                                           dateNaissance : dateDeNaissance});

            await Table_RelationCreationUtilisateurPersonnesARencontrer.create({id                   : uuid.v4(),
                                                                                      idUtilisateur        : tokenDecode.id,
                                                                                      idPersonneRencontree : idPersonne});
        }
        else //Si la personne existe déjà
        {
            await Table_RelationCreationUtilisateurPersonnesARencontrer.create({id                   : uuid.v4(),
                                                                                      idUtilisateur        : tokenDecode.id,
                                                                                      idPersonneRencontree : personne.id});
        }
        return res.status(201).send(personne);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de l'ajout de la personne");
    }
});

router.put('/',
           body('idPersonneARencontrer').isString().notEmpty(),
           body('nom').isString().notEmpty(),
           body('prenom').isString().notEmpty(),
           body('sexe').isInt().notEmpty(),
           body('dateNaissanceJour').isInt().notEmpty(),
           body('dateNaissanceMois').isInt().notEmpty(),
           body('dateNaissanceAnnee').isInt().notEmpty(),
           async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        const tokenDecode = jwtDecode(req.headers.authorization);
        const relationUtilisateurPersonnes = await Table_RelationCreationUtilisateurPersonnesARencontrer.findOne({
            where :
            {
                idUtilisateur        : tokenDecode.id,
                idPersonneRencontree : req.body.idPersonneARencontrer
            }
        });
        if(relationUtilisateurPersonnes.id == null)
            return res.status(403).send("Vous n'avez pas le droit d'acceder a cette ressource.");


        const dateDeNaissance = new Date(req.body.dateNaissanceAnnee, req.body.dateNaissanceMois - 1, req.body.dateNaissanceJour);

        if(!EstPersonneMajeure(dateDeNaissance))
            return res.status(400).send("La personne n'est pas majeure");

        await Table_PersonnesARencontrer.update(
            {
                nom           : req.body.nom,
                prenom        : req.body.prenom,
                sexe          : req.body.sexe,
                dateNaissance : dateDeNaissance
            }, {
            where :
            {
                id : req.body.idPersonneARencontrer
            }
        });
        return res.status(200).send("Personne modifiée !");
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la modification de la personne");
    }
});

router.delete('/',
              body('idPersonneARencontrer').isString().notEmpty(),
              async (req, res) =>
{
    try
    {
        const tokenDecode = jwtDecode(req.headers.authorization);
        const relationUtilisateurPersonnes = await Table_RelationCreationUtilisateurPersonnesARencontrer.findOne({
            where :
            {
                idUtilisateur        : tokenDecode.id,
                idPersonneRencontree : req.body.idPersonneARencontrer
            }
        });
        if(relationUtilisateurPersonnes.id == null)
            return res.status(403).send("Vous n'avez pas le droit d'acceder a cette ressource.");

        await Table_Rencontres.destroy({
            where :
            {
                idUtilisateur        : tokenDecode.id,
                idPersonneRencontree : req.body.idPersonneARencontrer
            }
        })

        await Table_RelationCreationUtilisateurPersonnesARencontrer.destroy({
            where :
            {
                idUtilisateur        : tokenDecode.id,
                idPersonneRencontree : req.body.idPersonneARencontrer
            }
        })

        const relationsAvecCettePersonne = await Table_RelationCreationUtilisateurPersonnesARencontrer.findAll({
            where :
            {
                idPersonneRencontree : req.body.idPersonneARencontrer
            }
        });
        if(relationsAvecCettePersonne.length == 0)
        {
            await SupprimerFichierImagePersonneARencontrer(req.body.idPersonneARencontrer);

            await Table_Images.destroy({
                where :
                {
                    idPersonneRencontree : req.body.idPersonneARencontrer
                }
            })

            await Table_PersonnesARencontrer.destroy({
                where :
                {
                    id : req.body.idPersonneARencontrer
                }
            })
        }

        return res.status(200).send("Personne Supprimée !");
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la suppression de la personne");
    }
});

exports.initializeRoutes = () => router;
