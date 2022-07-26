const fs = require('fs')
const path = require('path')
const queryDB = require('./queryDB')

const DB_QUERY_COMPLETE_ARRAY = fs.readFileSync(path.resolve('createDatabaseAndTablesQuery.sql'), 'utf8')

async function prepareDB() {
    const connectionURI = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
    }
    try {
        await queryDB(DB_QUERY_COMPLETE_ARRAY, connectionURI)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
    }
}

module.exports = prepareDB