var bcrypt = require('bcrypt')

async function encrypt(data) {
    return await bcrypt.hash(data, parseInt(process.env.TOKEN_SALTROUNDS))
}

module.exports = encrypt