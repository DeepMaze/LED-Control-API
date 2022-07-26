const express = require('express')
const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const queryDB = require('../helper/queryDB')
const { createAccessToken } = require('../helper/token')
const router = express.Router()

router.get('/login', async (req, res, next) => {
    let data = JSON.parse(req.query)
    if (!data?.username || !data?.password) res.status(400).send()

    let userData
    try {
        let loginResult = await checkLogin(req.query.username)
        if (!loginResult) res.status(400).send()

        let passwordResult = bcrypt.compare(data['password'], loginResult['password_encrypted'])
        if (!passwordResult) res.status(400).send()

        userData = {
            userID: rows[0]['id'],
            userName: req.query['username'],
            token: createAccessToken(loginResult.userID)
        }
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(userData)
})

const checkLogin = async (username) => {
    let query = `
        SELECT \`id\`, \`password_encrypted\` 
        FROM \`users\` 
        WHERE \`username\` = ${mysql.escape(username)}`;
    let rows
    try {
        [rows] = await queryDB(query);
    } catch (err) {
        throw err
    }
    return (rows.length > 0) ? (rows[0]) : (null)
}

module.exports = router