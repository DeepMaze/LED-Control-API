const debug = require('debug')('geraeteverwaltungapi:server')

function onListening(server) {
    let addr = (server) ? (server.address()) : ('')
    let bind = (typeof addr === 'string') ? (`port ${addr}`) : (`port ${addr.port}`)
    debug(`Listening on ${bind}`)
}

function onError(error) {
    if (error.syscall !== 'listen') throw error
    let bind = (typeof port === 'string') ? (`Port ${port}`) : (`Port ${port}`)
    if (error.code == 'EACCES') console.error(`${bind} requires elevated privileges`)
    else if (error.code == 'EADDRINUSE') console.error(`${bind} is already in use`)
    else throw error
    process.exit(1)
}

module.exports = { onListening, onError };