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

router.put('/createLight', async (req, res, next) => {
    var data = req.body
    var query = `
        INSERT INTO \`Lights\` (\`Key\`, \`RGB\`, \`Color\`, \`Dimmable\`, \`Luminosity\`)
        VALUES (
            ${mysql.escape(data['Key'])},
            ${mysql.escape(data['RGB'])},
            ${mysql.escape('#000000')},
            ${mysql.escape(data['Dimmable'])},
            ${mysql.escape(0)}
        )`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
        return;
    }
    res.status(204).send()
})

router.patch('/updateLight', async (req, res, next) => {
    var data = req.body
    var query = `
            UPDATE \`Lights\` 
            SET \`Key\` = ${mysql.escape(data['Key'])},
            \`Color\` = ${mysql.escape(data['Color'])},
            \`Luminosity\` = ${mysql.escape(parseFloat(data['Luminosity']))} 
            WHERE \`Key\` = ${mysql.escape(data['Key'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

router.delete('/deleteLight', async (req, res, next) => {
    var data = req.body
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