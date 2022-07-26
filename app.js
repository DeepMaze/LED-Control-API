const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const logger = require('morgan')
const prepareDB = require('./helper/prepareDB')
const cors = require('cors')
const app = express()

app.use(cors({ origin: '*' }))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.SQL_PREPARE_DB) prepareDB()

const routes = [
    { path: '/login', file: './routes/light' },
    { path: '/config', file: './routes/config' },
    { path: '/user', file: './routes/user' },
    { path: '/light', file: './routes/light' }
]

routes.forEach(route =>
    app.use(route.path, require(route.file))
)

module.exports = app