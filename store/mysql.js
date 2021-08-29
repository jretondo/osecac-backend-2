const mysql = require('mysql')
const config = require('../config').mysql

const dbconf = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
}

let connection

const handleCon = () => {
    connection = mysql.createConnection(dbconf)

    connection.connect((err) => {
        if (err) {
            console.error("[db] ", err)
            setTimeout(() => {
                handleCon()
            }, 2000);
        } else {
            console.log("DB Connected")
        }
    })

    connection.on("error", err => {
        console.error("[db] ", err)
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleCon()
        } else {
            throw err
        }
    })
}

handleCon()

const list = (table) => {
    return new Promise((resolve, reject) => {
        connection.query(` SELECT * FROM ${table} `, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const get = (table, id) => {
    return new Promise((resolve, reject) => {
        connection.query(` SELECT * FROM ${table} WHERE id = '${id}' `, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const insert = (table, data) => {
    return new Promise((resolve, reject) => {
        connection.query(` INSERT INTO ${table} SET ? `, data, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const remove = (table, data) => {

    return new Promise((resolve, reject) => {
        connection.query(` DELETE FROM ${table} WHERE ? `, [data], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const update = (table, data) => {
    return new Promise((resolve, reject) => {
        let { id, ...datos2 } = data
        connection.query(` UPDATE ${table} SET ? WHERE id = ? `, [datos2, data.id], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const query = (table, query, join) => {
    let joinQuery = '';
    if (join) {
        const key = Object.keys(join)[0];
        const val = join[key];
        joinQuery = ` JOIN ${key} ON ${table}.${val} = ${key}.id `;
    }

    return new Promise((resolve, reject) => {
        connection.query(` SELECT * FROM ${table} ${joinQuery} WHERE ${table}.? `, query, (err, res) => {
            if (err) return reject(err);
            resolve(res || null);
        })
    })
}

const customQuery = (query, data) => {
    return new Promise((resolve, reject) => {
        connection.query(query, data, (err, res) => {
            if (err) return reject(err);
            resolve(res || null);
        })
    })
}


module.exports = {
    list,
    get,
    insert,
    update,
    query,
    remove,
    customQuery
}