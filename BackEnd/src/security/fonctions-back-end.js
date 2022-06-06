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

exports.generateAuthToken = (utilisateur) =>
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

exports.generateHashedPassword = (password) =>
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

exports.passwordsAreEqual = (rawPassword, hashedPassword) =>
{
    return bcrypt.compareSync(rawPassword, hashedPassword);
}
