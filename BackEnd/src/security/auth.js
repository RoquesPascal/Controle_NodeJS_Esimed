const { sign } = require('jsonwebtoken');

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

exports.EstRole_moderateur = (jwtDecode) =>
{
    for(let i = 0 ; i < jwtDecode.roles.length ; i++)
    {
        if(jwtDecode.roles[i] == "moderateur")
            return true;
    }

    return false;
};
