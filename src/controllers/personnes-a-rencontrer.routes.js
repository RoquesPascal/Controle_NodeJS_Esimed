const express = require('express');
const { body, validationResult} = require('express-validator');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { validateBody } = require('./validation/route.validator');
const uuid = require('uuid');
const Table_Rencontres = require("../models/rencontre.model");
const Table_PersonnesARencontrer = require("../models/personnes-a-rencontrer.model");
const jwtDecode = require("jwt-decode");
const {generateHashedPassword} = require("../security/crypto");



router.post('/',
            body('nom').isString().notEmpty(),
            body('prenom').isString().notEmpty(),
            body('sexe').isInt().notEmpty(),
            async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        let dateDeNaissance = new Date(req.body.dateNaissanceAnnee, req.body.dateNaissanceMois - 1, req.body.dateNaissanceJour);
        await Table_PersonnesARencontrer.create({id            : uuid.v4(),
                                                       nom           : req.body.nom,
                                                       prenom        : req.body.prenom,
                                                       sexe          : req.body.sexe,
                                                       dateNaissance : dateDeNaissance});
        res.status(201).send("Personne ajoutée !");
    }
    catch(e)
    {
        res.status(400).send("Erreur lors de l'ajout de la personne");
    }
});

router.put('/',
           body('idPersonneARencontrer').isString().notEmpty(),
           body('nom').isString().notEmpty(),
           body('prenom').isString().notEmpty(),
           body('sexe').isInt().notEmpty(),
           async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        let dateDeNaissance = new Date(req.body.dateNaissanceAnnee, req.body.dateNaissanceMois - 1, req.body.dateNaissanceJour);
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
        res.status(200).send("Personne modifiée !");
    }
    catch(e)
    {
        res.status(400).send("Erreur lors de la modification de la personne");
    }
});

router.delete('/',
              body('idPersonneARencontrer').isString().notEmpty(),
              async (req, res) =>
{
    try
    {
        await Table_Rencontres.destroy({
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
        res.status(200).send("Personne Supprimée !");
    }
    catch(e)
    {
        console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
        console.log(`${e}`)
        console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
        res.status(400).send("Erreur lors de la suppression de la personne");
    }
});

exports.initializeRoutes = () => router;
