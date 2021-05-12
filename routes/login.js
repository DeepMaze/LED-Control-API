var express = require('express')
var mysql = require('mysql2/promise')
var bcrypt = require('bcrypt')

var queryDB = require('../helper/queryDB')
var { createAccessToken } = require('../helper/token')



var router = express.Router()

router.get('/login', async (req, res, next) => {
    var data = JSON.parse(req.query)
    if (!data.userName || !data.passWord) res.status(400).send()

    try {
        var loginResult = await checkLogin(req.query.userName)
        if (!loginResult) res.status(400).send()

        var passWordResult = bcrypt.compare(data['passWord'], loginResult['PassWord_Encrypted'])
        if (!passWordResult) res.status(400).send()

        var userData = {
            userID: rows[0]['ID'],
            userName: req.query['userName'],
            token: createAccessToken(loginResult.userID)
        }
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }

    res.status(200).send(userData)
})

const checkLogin = async (userName) => {
    var query = `
        SELECT \`ID\`, \`PassWord_Encrypted\` 
        FROM \`Users\` 
        WHERE \`UserName\` = ${mysql.escape(userName)}`;
    try {
        var [rows] = await queryDB(query);
    } catch (err) {
        throw err
    }
    return (rows.length > 0) ? (rows[0]) : (null)
}

module.exports = router