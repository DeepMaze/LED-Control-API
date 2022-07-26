const express = require('express')
const mysql = require('mysql2/promise')
const { authenticateToken } = require('../helper/token')
const queryDB = require('../helper/queryDB')
const router = express.Router()

// router.use('/*', authenticateToken);

router.get('/getLights', async (req, res, next) => {
    let query = `
        SELECT * 
        FROM \`lights\``
    let rows
    try {
        [rows] = await queryDB(query)
    } catch (err) {
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.get('/getLight', async (req, res, next) => {
    let query = `
        SELECT * 
        FROM \`lights\` 
        WHERE ${mysql.escape(req.query['id'])}`
    let rows
    try {
        [rows] = await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.put('/createLight', async (req, res, next) => {
    let query = `
        INSERT INTO \`lights\` (\`key\`, \`is_rgb\`, \`color\`, \`dimmable\`, \`luminosity\`)
        VALUES (
            ${mysql.escape(req.query['key'])},
            ${mysql.escape(req.query['is_rgb'])},
            ${mysql.escape('#000000')},
            ${mysql.escape(req.query['dimmable'])},
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
    let query = `
            UPDATE \`lights\` 
            SET \`key\` = ${mysql.escape(req.query['key'])},
            \`color\` = ${mysql.escape(req.query['color'])},
            \`luminosity\` = ${mysql.escape(parseFloat(req.query['luminosity']))} 
            WHERE \`key\` = ${mysql.escape(req.body['key'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

router.delete('/deleteLight', async (req, res, next) => {
    let query = `
        DELETE FROM \`lights\` 
        WHERE \`key\` = ${mysql.escape(req.query['key'])}`
    try {
        await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(204).send()
})

module.exports = router