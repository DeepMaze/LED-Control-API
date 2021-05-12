var express = require('express')
var mysql = require('mysql2/promise')

var { authenticateToken } = require('../helper/token')
var queryDB = require('../helper/queryDB')
var encrypt = require('../helper/encryption')
var buildUpdateSetString = require('../helper/buildUpdateSetString')



var router = express.Router()

router.use('/*', authenticateToken);

router.get('/getUsersList', async (req, res, next) => {
    var query = `
        SELECT * 
        FROM \`Users\``
    try {
        var [rows] = await queryDB(query)
    } catch (err) {
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.get('/getUser', async (req, res, next) => {
    var data = JSON.parse(req.query)
    var query = `
        SELECT * 
        FROM \`Users\` 
        WHERE ${mysql.escape(data['userID'])}`
    try {
        var [rows] = await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.get('/createUser', async (req, res, next) => {
    var data = JSON.parse(req.query)
    var query = `
        INSERT INTO \`Users\` (\`UserName\`, \`PassWord_Encrypted\`)
        VALUES (${mysql.escape(data['userName'])}, '${await encrypt(mysql.escape(data['passWord']))}')`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send({ success: false })
        return;
    }
    res.status(204).send({ success: true })
})

router.put('/updateUser', async (req, res, next) => {
    var data = JSON.parse(req.body)
    var query = `
        UPDATE \`Users\` 
        SET ${buildUpdateSetString(data['data'])} 
        WHERE \`ID\` = ${mysql.escape(data['userID'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

router.post('/deleteUser', async (req, res, next) => {
    var data = JSON.parse(req.body)
    var query = `
        DELETE FROM \`Users\` 
        WHERE \`ID\` = ${mysql.escape(data['userID'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

module.exports = router