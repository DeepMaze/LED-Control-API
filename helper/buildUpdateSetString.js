var mysql = require('mysql2')



function buildUpdateSetString(data) {
    var set = ''
    for (var key in data) {
        if (key == 'ID') continue
        set += `${key} = ${mysql.escape(data[key])}, `
    }
    set = `${set.substr(0, set.length - 2)} `
    return set
}

module.exports = buildUpdateSetString