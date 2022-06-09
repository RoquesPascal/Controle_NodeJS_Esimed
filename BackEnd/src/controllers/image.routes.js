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
const {SupprimerFichierImagePersonneARencontrer, EstFichierDeType_JPG_PNG} = require("../fonctions-back-end/fonctions-back-end");



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
        /*if(!image)
            return res.status(404).send('Pas de fichier');*/

        return res.status(200).send(image);
    }
    catch(e)
    {
        return res.status(500).send(`erreur de la récupération de l'image`);
    }
})

router.post('/:idPersonneRencontree',
            upload.single('fichier'),
            async (req, res) =>
{
    try
    {
        const image = req.file;
        if(!EstFichierDeType_JPG_PNG(image))
            return res.status(400).send(`Erreur, le fichier n'est pas au format .jpg ou .png`);

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
            return res.status(403).send(`Vous n'avez pas le droit de créer une image pour cette ressource`);




        if(!image)
            return res.status(400).send('Pas de fichier');

        await Table_Images.create({id                   : uuid.v4(),
                                         idPersonneRencontree : req.params.idPersonneRencontree,
                                         nomUnique            : image.filename,
                                         nomOriginal          : image.originalname,
                                         chemin               : image.destination,
                                         type                 : image.mimetype,
                                         taille               : image.size});

        return res.status(201).send(`image creee !`);
    }
    catch(e)
    {
        return res.status(500).send(`erreur de la création de l'image`);
    }
});

router.delete('/:idPersonneRencontree',
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
                return res.status(403).send(`Vous n'avez pas le droit d'acceder a cette ressource.`);


            await SupprimerFichierImagePersonneARencontrer(req.params.idPersonneRencontree);

            await Table_Images.destroy({
                where :
                {
                    idPersonneRencontree : req.params.idPersonneRencontree
                }
            })

            return res.status(201).send(`image creee !`);
        }
        catch(e)
        {
            return res.status(500).send(`erreur de la création de l'image`);
        }
    });

exports.initializeRoutes = () => router;
