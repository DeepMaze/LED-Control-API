var mysql = require('mysql2/promise')



async function queryDB(query, connectionURI = {}) {
    if (Object.keys(connectionURI).length == 0) {
        var connectionURI_TEMP = {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        }
        connectionURI = connectionURI_TEMP
    }
    var rows
    var connection
    try {
        connection = await mysql.createConnection(connectionURI)
        rows = await connection.execute(query)
    } catch (err) {
        throw err
    } finally {
        connection?.end()
    }
    return rows
}

module.exports = queryDB