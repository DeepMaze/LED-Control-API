const express = require('express')
const mysql = require('mysql2/promise')
const { authenticateToken } = require('../helper/token')
const queryDB = require('../helper/queryDB')
const encrypt = require('../helper/encryption')
const buildUpdateSetString = require('../helper/buildUpdateSetString')
const router = express.Router()

// router.use('/*', authenticateToken)

router.get('/getUsersList', async (req, res, next) => {
    let query = `
        SELECT * 
        FROM \`users\``
    let rows
    try {
        [rows] = await queryDB(query)
    } catch (err) {
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.get('/getUser', async (req, res, next) => {
    let query = `
        SELECT * 
        FROM \`users\` 
        WHERE ${mysql.escape(req.query['userID'])}`
    let rows
    try {
        [rows] = await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.post('/createUser', async (req, res, next) => {
    let query = `
        INSERT INTO \`users\` (\`username\`, \`password_encrypted\`)
        VALUES (${mysql.escape(req.body['username'])}, '${await encrypt(mysql.escape(req.body['password']))}')`
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
    let query = `
        UPDATE \`users\` 
        SET ${buildUpdateSetString(req.body['data'])} 
        WHERE \`id\` = ${mysql.escape(req.body['userID'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

router.delete('/deleteUser', async (req, res, next) => {
    let query = `
        DELETE FROM \`users\` 
        WHERE \`id\` = ${mysql.escape(req.query['userID'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

module.exports = router