const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');



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
