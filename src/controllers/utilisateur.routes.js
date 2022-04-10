const express = require('express');
const router = express.Router();
const Table_Utilisateurs = require("../models/utilisateur.model");



router.get('/',
           async (req, res) =>
{
    try
    {
        const tousLesUtilisateurs = await Table_Utilisateurs.findAll();
        return res.status(200).send(tousLesUtilisateurs);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération des utilisateurs");
    }
});

router.get('/:id',
           async (req, res) =>
{
    try
    {
        const utilisateur = await Table_Utilisateurs.findOne({
            where :
                {
                    id : req.params.id
                }
        });
        return res.status(200).send(utilisateur);
    }
    catch(e)
    {
        return res.status(400).send("Erreur lors de la récupération de l'utilisateur'");
    }
});

exports.initializeRoutes = () => router;
