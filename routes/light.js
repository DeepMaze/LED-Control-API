var express = require('express')
var mysql = require('mysql2/promise')

var { authenticateToken } = require('../helper/token')
var queryDB = require('../helper/queryDB')
var encrypt = require('../helper/encryption')
var buildUpdateSetString = require('../helper/buildUpdateSetString')



var router = express.Router()

// router.use('/*', authenticateToken);

router.get('/getLights', async (req, res, next) => {
    var query = `
        SELECT * 
        FROM \`Lights\``
    try {
        var [rows] = await queryDB(query)
    } catch (err) {
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.get('/getLight', async (req, res, next) => {
    var data = JSON.parse(req.query)
    var query = `
        SELECT * 
        FROM \`Lights\` 
        WHERE ${mysql.escape(data['ID'])}`
    try {
        var [rows] = await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.get('/createLight', async (req, res, next) => {
    var data = JSON.parse(req.query)
    var query = `
        INSERT INTO \`Lights\` (\`Key\`, \`RGB\`, \`Dimmable\`)
        VALUES (
            ${mysql.escape(data['Key'])}, 
            ${mysql.escape(data['RGB'])},
            ${mysql.escape(data['Dimmable'])}
        )`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send({ success: false })
        return;
    }
    res.status(204).send({ success: true })
})

router.put('/updateLight', async (req, res, next) => {
    var data = JSON.parse(req.body)
    var query = `
        UPDATE \`Lights\` 
        SET ${buildUpdateSetString(data)} 
        WHERE \`Key\` = ${mysql.escape(data['Key'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

router.post('/deleteLight', async (req, res, next) => {
    var data = JSON.parse(req.body)
    var query = `
        DELETE FROM \`Lights\` 
        WHERE \`Key\` = ${mysql.escape(data['Key'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

module.exports = router