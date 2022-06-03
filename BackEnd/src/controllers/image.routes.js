const express      = require('express');
const router       = express.Router();
const multer       = require('multer');
const uuid         = require("uuid");
const upload       = multer({ dest: 'uploads/' });
const Table_Images = require("../models/image.model");
const jwtDecode    = require("jwt-decode");
const fileUpload   = require('express-fileupload');
const Table_PersonnesARencontrer = require("../models/personnes-a-rencontrer.model");
const Table_RelationCreationUtilisateurPersonnesARencontrer = require("../models/relation-creation-utilisateur-personne-a-rencontrer.model");


router.use(fileUpload());

router.get('/:id', async (req, res) =>
{
    try
    {
        const image = await Table_Images.findOne({
            where :
            {
                id : req.params.id
            }
        });

        res.download(`${image.chemin + image.nomUnique}`, image.nomOriginal);
    }
    catch(e)
    {
        res.status(500).send(`erreur de la récupération de l'image`);
    }
})

router.post('/personne-rencontree/:idPersonneRencontree',
            upload.single('file'),
            async (req, res) =>
{
    try
    {
        const tokenDecode = jwtDecode(req.headers.authorization);
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
            res.status(403).send(`Vous n'avez pas le droit de créer une image pour cette ressource`);



        const image = req.file;

        if(!image)
            return res.status(400).send('Pas de fichier');

        await Table_Images.create({id                   : uuid.v4(),
                                         idPersonneRencontree : req.params.idPersonneRencontree,
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
