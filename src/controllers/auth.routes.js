const express = require('express');
const router = express.Router();
const { passwordsAreEqual, generateHashedPassword} = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');
const {body, validationResult} = require("express-validator");
const uuid = require('uuid');
const Table_Utilisateurs = require("../models/user.model");
const jwtDecode = require("jwt-decode");



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
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.pseudo);
    res.status(200).send(`Connexion réussie ! Token = ${token}`);
});

router.post('/signin',
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
        await Table_Utilisateurs.create({id         : uuid.v4(),
                                               pseudo     : req.body.pseudo,
                                               email      : req.body.email,
                                               motDePasse : generateHashedPassword(req.body.motDePasse)});
        res.status(201).send("Utilisateur créé !");
    }
    catch(e)
    {
        res.status(409).send("Un utilisateur avec cet e-mail existe déjà. Veuillez en entrer un autre.");
    }
});

exports.initializeRoutes = () => router;
