var debug = require('debug')('geraeteverwaltungapi:server')



function onListening(server) {
    var addr = (server) ? (server.address()) : ('')
    var bind = (typeof addr === 'string') ? (`pipe ${addr}`) : (`port ${addr.port}`)
    debug(`Listening on ${bind}`)
}

function onError(error) {
    if (error.syscall !== 'listen') throw error
    var bind = (typeof port === 'string') ? (`Pipe ${port}`) : (`Port ${port}`)
    if (error.code == 'EACCES') console.error(`${bind} requires elevated privileges`)
    else if (error.code == 'EADDRINUSE') console.error(`${bind} is already in use`)
    else throw error
    process.exit(1)
}

module.exports = { onListening, onError };