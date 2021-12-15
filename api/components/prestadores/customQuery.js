const getListLimit = (table, page, busqueda) => {
    const desdePag = ((parseInt(page) - 1) * 10)

    return ` SELECT * FROM ${table} WHERE (cuit LIKE '%${busqueda}%' OR nro_prest LIKE '%${busqueda}%' OR raz_soc LIKE '%${busqueda}%' OR email LIKE '%${busqueda}%') ORDER BY raz_soc LIMIT ${desdePag}, 10 `
}

const getCantTotal = (table, busqueda) => {
    return ` SELECT COUNT(*) AS CANT FROM ${table} WHERE  (cuit LIKE '%${busqueda}%' OR nro_prest LIKE '%${busqueda}%' OR raz_soc LIKE '%${busqueda}%' OR email LIKE '%${busqueda}%') ORDER BY raz_soc `
}
module.exports = {
    getListLimit,
    getCantTotal
}