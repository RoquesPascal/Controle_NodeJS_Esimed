const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { validateBody } = require('./validation/route.validator');
const uuid = require('uuid');
const Table_Utilisateurs = require("../models/user.model");
const Table_Rencontres = require("../models/rencontre.model");
const Table_SessionsRencontres = require("../models/session-rencontre.model");


router.get('/', async (req, res) => {
    const allUsers = await Table_Utilisateurs.findAll();
    res.send(allUsers);
});

router.get('/:firstName', async (req, res) => {
    const foundUser = await Table_Utilisateurs.findAll({
        where:{
            firstName: req.params.firstName
        }
    })
    res.send(foundUser);
});

router.post('/',
            body('firstName').notEmpty(),
            body('lastName').notEmpty(),
            body('password').notEmpty().isLength({ min: 5 }),
            async (req, res) =>
{
    validateBody(req);

    await Table_Utilisateurs.create({id:uuid.v4(), firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password});
    res.status(201).end();
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
