const insertPermissions = async (table, items, idUser) => {
    let headers = `(id_user, id_permission)`
    return new Promise((resolve, reject) => {
        let permissions = []
        items.map(item => {
            const idPermiso = item.idPermiso
            permissions.push(
                `(${idUser}, ${idPermiso})`
            )
        })
        resolve(` INSERT INTO ${table} ${headers} VALUES ${permissions} `)
    })
}

const getPermision = (table, idPermission, idUser) => {
    return ` SELECT * FROM ${table} WHERE id_user = '${idUser}' AND id_permission = '${idPermission}' `
}

const get = (table, idUser) => {
    return ` SELECT * FROM ${table} WHERE id_user = '${idUser}' `
}

module.exports = {
    insertPermissions,
    getPermision,
    get
}