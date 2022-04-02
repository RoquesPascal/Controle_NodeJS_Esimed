const express = require('express');
const { body, validationResult} = require('express-validator');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { validateBody } = require('./validation/route.validator');
const uuid = require('uuid');
const Table_Utilisateurs = require("../models/utilisateur.model");
const Table_Rencontres = require("../models/rencontre.model");
const Table_SessionsRencontres = require("../models/session-rencontre.model");
const jwtDecode = require("jwt-decode");
const {generateHashedPassword} = require("../security/crypto");



router.get('/',
           async (req, res) =>
{
    const allUsers = await Table_Utilisateurs.findAll();
    res.send(allUsers);
});

router.post('/',
            body('nom').isString().notEmpty(),
            body('prenom').isString().notEmpty(),
            body('sexe').isInt().notEmpty(),
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
        let dateDeNaissance = new Date(req.body.dateNaissanceAnnee, req.body.dateNaissanceMois - 1, req.body.dateNaissanceJour);
        let dateDeLaRencontre = new Date(req.body.dateRencontreAnnee, req.body.dateRencontreMois - 1, req.body.dateRencontreJour);
        const rencontre = await Table_Rencontres.create({id            : uuid.v4(),
                                                                 nom           : req.body.nom,
                                                                 prenom        : req.body.prenom,
                                                                 sexe          : req.body.sexe,
                                                                 dateNaissance : dateDeNaissance,
                                                                 dateRencontre : dateDeLaRencontre,
                                                                 note          : req.body.note,
                                                                 commentaire   : req.body.commentaire});

        const tokenDecode = jwtDecode(req.headers.authorization);
        await Table_SessionsRencontres.create({id            : uuid.v4(),
                                                     idUtilisateur : tokenDecode.id,
                                                     idRencontre   : rencontre.id})
        res.status(201).send("Rencontre Ajoutée !");
    }
    catch(e)
    {
        res.status(409).send("Erreur lors de l'ajout de la rencontre");
    }
});

router.put('/', async (req, res) => {
    await Table_Utilisateurs.update({ lastName: "Doe" }, {
        where: {
            firstName: "Jean"
        }
    });
    res.status(204).end();
});

router.delete('/', async (req, res) => {
    await Table_Utilisateurs.destroy({
        where: {
            firstName: req.body.firstName
        }
    })
    res.status(204).end();
});

exports.initializeRoutes = () => router;
