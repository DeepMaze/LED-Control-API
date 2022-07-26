const mysql = require('mysql2')

function buildUpdateSetString(data) {
    let set = ''
    for (let key in data) {
        if (key == 'id') continue
        set += `${key} = ${mysql.escape(data[key])}, `
    }
    set = `${set.substring(0, set.length - 2)} `
    return set
}

module.exports = buildUpdateSetString