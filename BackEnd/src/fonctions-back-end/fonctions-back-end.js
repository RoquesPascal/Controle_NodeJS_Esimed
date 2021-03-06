const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const fs = require('fs');
const Table_Images = require("../models/image.model");


exports.EstFichierDeType_JPG_PNG = (fichier) =>
{
    return fichier.originalname.match(/\.(jpg|JPG|png|PNG|)$/);
};

exports.EstRencontreDejaFaite = (rencontre) =>
{
    const dateActuelle = new Date(Date.now());
    const dateDeLaRencontre = rencontre.dateRencontre.toString(); //Car les GetDate() et tout ne fonctionnent pas

    if(dateActuelle.getFullYear() > parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])) //Année actuelle > année rencontre
        return true;
    else if(dateActuelle.getFullYear() < parseInt(dateDeLaRencontre[0] + dateDeLaRencontre[1] + dateDeLaRencontre[2] + dateDeLaRencontre[3])) //Année actuelle < année rencontre
        return false;
    else
    {
        if(dateActuelle.getMonth() + 1 > parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])) //Mois actuel > mois rencontre
            return true;
        else if(dateActuelle.getMonth() + 1 < parseInt(dateDeLaRencontre[5] + dateDeLaRencontre[6])) //Mois actuel < mois rencontre
            return false;
        else
        {
            if(dateActuelle.getDate() >= parseInt(dateDeLaRencontre[8] + dateDeLaRencontre[9])) //Jour actuel >= jour rencontre
                return true;
            else //Jour actuel < jour rencontre
                return false;
        }
    }
};

exports.EstPersonneMajeure = (dateNaissance) =>
{
    let dateActuelle18AnsEnArriere = new Date(Date.now());
    dateActuelle18AnsEnArriere.setFullYear(dateActuelle18AnsEnArriere.getFullYear() - 18);
    return (dateActuelle18AnsEnArriere >= dateNaissance);
};

exports.EstRole_moderateur = (jwtDecode) =>
{
    for(let i = 0 ; i < jwtDecode.roles.length ; i++)
    {
        if(jwtDecode.roles[i] == "moderateur")
            return true;
    }

    return false;
};

exports.GenerateAuthToken = (utilisateur) =>
{
    const id     = utilisateur.id;
    const pseudo = utilisateur.pseudo;
    const email  = utilisateur.email;
    const roles  = utilisateur.roles;

    return sign(
        { id, pseudo, email, roles },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );
};

exports.GenerateHashedPassword = (password) =>
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

exports.PasswordsAreEqual = (rawPassword, hashedPassword) =>
{
    return bcrypt.compareSync(rawPassword, hashedPassword);
}

exports.SupprimerFichierImagePersonneARencontrer = async (idPersonneARencontrer) =>
{
    const image = await Table_Images.findOne({
        where:
        {
            idPersonneRencontree : idPersonneARencontrer
        }
    })
    if(image != null)
        fs.unlink(image.chemin + image.nomUnique, function (err) { if(err) throw err; });
}

exports.TrierPersonnesParNomPuisPrenom = (listePersonnes) =>
{
    let trier = false;
    let nbrElemRestants = 0;
    let personneTemp;

    do
    {
        nbrElemRestants = 0;

        for(let i = 1 ; i < listePersonnes.length ; i++)
        {
            if(listePersonnes[i].nom.toLowerCase() < listePersonnes[i-1].nom.toLowerCase()) trier = true;
            else if(listePersonnes[i].nom == listePersonnes[i-1].nom)
                trier = listePersonnes[i].prenom.toLowerCase() < listePersonnes[i-1].prenom.toLowerCase();
            else trier = false;

            if(trier)
            {
                nbrElemRestants = nbrElemRestants + 1;

                personneTemp = listePersonnes[i - 1];
                listePersonnes[i - 1] = listePersonnes[i];
                listePersonnes[i] = personneTemp;
            }
        }
    } while(nbrElemRestants != 0);

    return listePersonnes;
}
