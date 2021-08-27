const db = {}

const list = async (tabla) => {
    return db[tabla]
}

const get = async (tabla, id) => {
    let col = await list(tabla)
    return col.filter(item => item, id === id)[0] || null
}

const upsert = async (tabla, data) => {
    if (!db[tabla]) {
        db[tabla] = []
    }
    db[tabla].push(data)
}

const remove = (tabla, id) => {

}

async function query(tabla, q) {
    let col = await list(tabla);
    let keys = Object.keys(q);
    let key = keys[0];

    return col.filter(item => item[key] === q[key])[0] || null;
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query
}