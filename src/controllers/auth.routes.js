const express = require('express');
const router = express.Router();
const { passwordsAreEqual, generateHashedPassword} = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');
const {body, validationResult} = require("express-validator");
const uuid = require('uuid');
const Table_Utilisateurs = require("../models/utilisateur.model");



router.post('/login',
            body('email').notEmpty(),
            body('motDePasse').notEmpty(),
            async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const utilisateur = await Table_Utilisateurs.findOne({
        where:{
            email: req.body.email
        }
    })

    if(!utilisateur || !passwordsAreEqual(req.body.motDePasse, utilisateur.motDePasse))
        return res.status(404).send("Erreur ! Au moins un des champs saisis est incorrect.");

    const token = generateAuthToken(utilisateur.id, utilisateur.pseudo, utilisateur.email);
    return res.status(200).send(token);
});

router.post('/signup',
            body('pseudo').isString().notEmpty(),
            body('email').isEmail().notEmpty(),
            body('motDePasse').isLength({min : 5}).notEmpty(),
            async (req, res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try
    {
        const utilisateur = await Table_Utilisateurs.create({id         : uuid.v4(),
                                                                   pseudo     : req.body.pseudo,
                                                                   email      : req.body.email,
                                                                   motDePasse : generateHashedPassword(req.body.motDePasse)});

        const token = generateAuthToken(utilisateur.id, utilisateur.pseudo, utilisateur.email);
        return res.status(201).send(token);
    }
    catch(e)
    {
        res.status(409).send("Un utilisateur avec cet e-mail existe déjà. Veuillez en entrer un autre.");
    }
});

exports.initializeRoutes = () => router;
