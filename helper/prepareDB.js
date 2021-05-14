var mysql = require('mysql2/promise')
var fs = require('fs')
var path = require('path')

var encrypt = require('./encryption')
var queryDB = require('./queryDB')
var configs = require('./defaultDB/config.js')
var roles = require('./defaultDB/role.js')
var users = require('./defaultDB/user.js')



const DB_QUERY_COMPLETE_ARRAY = fs.readFileSync(path.resolve('createDatabaseAndTablesQuery.sql'), 'utf8').split(';')

const DB_QUERY_SPLIT = {
    db: DB_QUERY_COMPLETE_ARRAY[0],
    Configs: DB_QUERY_COMPLETE_ARRAY[1],
    Roles: DB_QUERY_COMPLETE_ARRAY[2],
    Users: DB_QUERY_COMPLETE_ARRAY[3],
    Lights: DB_QUERY_COMPLETE_ARRAY[4],
}

async function prepareDB() {
    await checkAndCreateDatabase()
    await checkAndCreateTables()
    await checkAndCreateConfigs()
    await checkAndCreateRoles()
    await checkAndCreateUsers()
}

async function checkAndCreateDatabase() {
    var connectionURI = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
    }
    var query = `
        SELECT SCHEMA_NAME
        FROM INFORMATION_SCHEMA.SCHEMATA 
        WHERE SCHEMA_NAME = ${mysql.escape(process.env.MYSQL_DATABASE)}`
    try {
        var [rows] = await queryDB(query, connectionURI)
        if (rows.length == 0) [rows] = await queryDB(DB_QUERY_SPLIT.db, connectionURI)
    } catch (err) {
        if (process.env.DEBUG) console.error('[ERROR]: ', err)
    }
}

async function checkAndCreateTables() {
    for (var table in DB_QUERY_SPLIT) {
        if (table == 'db') continue
        var query = `
            SHOW TABLES 
            LIKE ${mysql.escape(table)}`
        try {
            var [rows] = await queryDB(query)
            if (rows.length == 0) [rows] = await queryDB(DB_QUERY_SPLIT[table])
        } catch (err) {
            console.log(DB_QUERY_SPLIT[table])
            if (process.env.DEBUG) console.error('[ERROR]: ', err)
        }
    }
}

async function checkAndCreateConfigs() {
    for (var item of configs) {
        var selectQuery = `
            SELECT \`Key\`, \`Value\` 
            FROM \`Configs\`
            WHERE \`Key\` = ${mysql.escape(item['Key'])}`
        try {
            var [rows] = await queryDB(selectQuery)
            if (rows.length > 0) return
            insertConfig(item)
        } catch (err) {
            if (process.env.DEBUG) console.error('[ERROR]: ', err)
        }
    }
}

async function insertConfig(item) {
    var insertQuery = `
        INSERT INTO \`Configs\` (\`Key\`, \`Value\`) 
        VALUES (
            ${mysql.escape(item['Key'])}, 
            ${mysql.escape(item['Value'])}
        )`
    try {
        [rows] = await queryDB(insertQuery)
    } catch (err) {
        throw err
    }
}

async function checkAndCreateRoles() {
    for (var item of roles) {
        var selectQuery = `
        SELECT \`Label\` 
        FROM \`Roles\` 
        WHERE \`Label\` = ${mysql.escape(item['Label'])}`
        try {
            var [rows] = await queryDB(selectQuery)
            if (rows.length > 0) return
            insertRole(item)
        } catch (err) {
            if (process.env.DEBUG) console.error('[ERROR]: ', err)
        }
    }
}

async function insertRole(item) {
    var insertQuery = `
        INSERT INTO \`Roles\` (\`Label\`, \`Description\`) 
        VALUES (
            ${mysql.escape(item['Label'])}, 
            ${mysql.escape(item['Description'])}
        )`
    try {
        await queryDB(insertQuery)
    } catch (err) {
        throw err
    }
}

async function checkAndCreateUsers() {
    for (var item of users) {
        var selectQuery = `
        SELECT \`UserName\` 
        FROM \`Users\` 
        WHERE \`UserName\` = ${mysql.escape(item['UserName'])}`
        try {
            var [rows] = await queryDB(selectQuery)
            if (rows.length > 0) return
            insertUser(item);
        } catch (err) {
            if (process.env.DEBUG) console.error(err)
        }
    }
}

async function insertUser(item) {
    var insertQuery = `
        INSERT INTO \`Users\` (\`UserName\`, \`PassWord_Encrypted\`, \`RoleID\`) 
        VALUES (
            ${mysql.escape(item['UserName'])}, 
            ${mysql.escape(await encrypt(item['PassWord']))}, 
            ${mysql.escape(item['RoleID'])}
        )`
    try {
        await queryDB(insertQuery)
    } catch (err) {
        throw err
    }
}

module.exports = prepareDB