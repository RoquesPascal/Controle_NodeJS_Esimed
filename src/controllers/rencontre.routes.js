const express = require('express');
const { body, validationResult} = require('express-validator');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { validateBody } = require('./validation/route.validator');
const uuid = require('uuid');
const Table_Rencontres = require("../models/rencontre.model");
const jwtDecode = require("jwt-decode");
const {generateHashedPassword} = require("../security/crypto");
const Table_PersonnesARencontrer = require("../models/personnes-a-rencontrer.model");



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

router.get('/:idUtilisateur',
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

router.post('/',
            body('idPersonneRencontree').isString().notEmpty(),
            body('dateRencontreJour').isInt().notEmpty(),
            body('dateRencontreMois').isInt().notEmpty(),
            body('dateRencontreAnnee').isInt().notEmpty(),
            body('note').isInt(),
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
                                             commentaire          : req.body.commentaire});
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
           async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        let dateDeLaRencontre = new Date(req.body.dateRencontreAnnee, req.body.dateRencontreMois - 1, req.body.dateRencontreJour);
        await Table_Rencontres.update(
            {
                idPersonneRencontree : req.body.idPersonneRencontree,
                dateRencontre        : dateDeLaRencontre,
                note                 : req.body.note,
                commentaire          : req.body.commentaire
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
