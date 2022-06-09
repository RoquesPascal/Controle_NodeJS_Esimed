const express      = require('express');
const router       = express.Router();
const multer       = require('multer');
const uuid         = require("uuid");
const upload       = multer({ dest: 'BackEnd/images/' });
const Table_Images = require("../models/image.model");
const jwtDecode    = require("jwt-decode");
const fileUpload   = require('express-fileupload');
const Table_PersonnesARencontrer = require("../models/personnes-a-rencontrer.model");
const Table_RelationCreationUtilisateurPersonnesARencontrer = require("../models/relation-creation-utilisateur-personne-a-rencontrer.model");



router.get('/:idPersonne', async (req, res) =>
{
    try
    {
        const image = await Table_Images.findOne({
            where :
            {
                idPersonneRencontree : req.params.idPersonne
            }
        });
        if(!image)
            return res.status(404).send('Pas de fichier');

        res.status(200).send(image);
    }
    catch(e)
    {
        res.status(500).send(`erreur de la récupération de l'image`);
    }
})

router.post('/',
            upload.single('fichier'),
            async (req, res) =>
{
    try
    {
        /*const tokenDecode = jwtDecode(req.headers.authorization);
        const relationUtilisateurPersonnes = await Table_RelationCreationUtilisateurPersonnesARencontrer.findOne({
            where :
            {
                idUtilisateur        : tokenDecode.id,
                idPersonneRencontree : req.params.idPersonneRencontree
            }
        });

        const personne = await Table_PersonnesARencontrer.findOne({
            where :
            {
                id : relationUtilisateurPersonnes.idPersonneRencontree
            }
        });

        if((personne == null) || (personne.id == null))
            return res.status(403).send(`Vous n'avez pas le droit de créer une image pour cette ressource`);*/



        const image = req.file;
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")
        console.log(image)

        if(!image)
            return res.status(400).send('Pas de fichier');

        await Table_Images.create({id                   : uuid.v4(),
                                         idPersonneRencontree : '4f01c98a-889d-4eef-a065-3d1f69ca73f6',
                                         nomUnique            : image.filename,
                                         nomOriginal          : image.originalname,
                                         chemin               : image.destination,
                                         type                 : image.mimetype,
                                         taille               : image.size});

        res.status(201).send(`image creee !`);
    }
    catch(e)
    {
        res.status(500).send(`erreur de la création de l'image`);
    }
});

exports.initializeRoutes = () => router;
