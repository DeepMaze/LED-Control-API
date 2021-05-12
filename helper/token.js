var fs = require('fs')
var path = require('path')
var jwt = require('jsonwebtoken')


const ACCESS_KEY = fs.readFileSync(path.resolve('keys\\private.key'), 'utf8')
const PUBLIC_KEY = fs.readFileSync(path.resolve('keys\\public.key'), 'utf8')

function createAccessToken(userID) {
    try {
        var token = jwt.sign({ userID }, ACCESS_KEY, { algorithm: 'RS256' })
    } catch (err) {
        throw err
    }
    return token
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send()

    jwt.verify(token, ACCESS_KEY, (err, user) => {
        if (err) {
            if (process.env.DEBUG) console.error('[ERROR]: ', err)
            return res.status(403).send()
        }
        req.user = user
        next()
    })
}

module.exports = { createAccessToken, authenticateToken }