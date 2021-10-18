const getListLimit = (table, page, busqueda, tipo) => {
    const desdePag = ((parseInt(page) - 1) * 10)

    return ` SELECT * FROM ${table} WHERE raz_soc LIKE '%${busqueda}%' AND tipo_prov = '${tipo}' LIMIT ${desdePag}, 10 `
}

const getCantTotal = (table, busqueda, tipo) => {
    return ` SELECT COUNT(*) AS CANT FROM ${table} WHERE raz_soc LIKE '%${busqueda}%' AND tipo_prov = '${tipo}' `
}
module.exports = {
    getListLimit,
    getCantTotal
}