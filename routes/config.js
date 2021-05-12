var express = require('express')
var mysql = require('mysql2/promise')

var { authenticateToken } = require('../helper/token')
var queryDB = require('../helper/queryDB')



var router = express.Router()

router.get('/getConfig', async (req, res, next) => {
    var query = `
        SELECT \`Config_Key\`, \`Config_Value\` 
        FROM \`Configs\``
    try {
        var [rows] = await queryDB(query)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
        res.status(500).send()
    }
    res.status(200).send(rows)
})

router.post('/updateConfig', authenticateToken, async (req, res, next) => {
    var data = JSON.parse(req.body)
    for (key in data) {
        var query = `
            UPDATE \`Configs\` 
            SET \`Config_Value\` = ${mysql.escape(data[key])} 
            WHERE \`Config_Key\` = ${mysql.escape(key)};`
        try {
            queryDB(query)
        } catch (err) {
            if (process.env.DEBUG) console.error('[ERROR]: ', err)
            res.status(500).send()
        }
    }
    res.status(204).send()
})

module.exports = router