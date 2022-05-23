const bcrypt = require('bcryptjs');

exports.generateHashedPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

exports.passwordsAreEqual = (rawPassword, hashedPassword) => {
    return bcrypt.compareSync(rawPassword, hashedPassword);
}
