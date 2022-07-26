const express = require('express')
const mysql = require('mysql2/promise')
const { authenticateToken } = require('../helper/token')
const queryDB = require('../helper/queryDB')
const router = express.Router()

router.get('/getConfig', async (req, res, next) => {
    let query = `
        SELECT \`key\`, \`value\` 
        FROM \`configs\``
    let rows
    try {
        [rows] = await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.post('/updateConfig', /* authenticateToken ,*/ async (req, res, next) => {
    for (key in req.query) {
        let query = `
            UPDATE \`configs\` 
            SET \`value\` = ${mysql.escape(req.query[key])} 
            WHERE \`key\` = ${mysql.escape(key)};`
        try {
            await queryDB(query)
        } catch (err) {
            if (process.env.DEBUG) console.error('[ERROR]: ', err)
            res.status(500).send()
        }
    }
    res.status(204).send()
})

module.exports = router