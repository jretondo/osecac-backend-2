const getListLimit = (table, page, busqueda, tipo) => {
    const desdePag = ((parseInt(page) - 1) * 10)

    return ` SELECT * FROM ${table} WHERE (raz_soc LIKE '%${busqueda}%' OR localidad LIKE '%${busqueda}%' OR encargado LIKE '%${busqueda}%' OR email LIKE '%${busqueda}%') AND tipo_prov = '${tipo}' LIMIT ${desdePag}, 10 `
}

const getList = (table, busqueda, tipo, cbu) => {
    let tieneCbu = ""
    if (cbu) {
        tieneCbu = ` AND cbu != ''`
    }
    return ` SELECT * FROM ${table} WHERE (raz_soc LIKE '%${busqueda}%' OR localidad LIKE '%${busqueda}%' OR encargado LIKE '%${busqueda}%' OR email LIKE '%${busqueda}%') AND tipo_prov = '${tipo}' ${tieneCbu} ORDER BY raz_soc`
}

const getCantTotal = (table, busqueda, tipo) => {
    return ` SELECT COUNT(*) AS CANT FROM ${table} WHERE (raz_soc LIKE '%${busqueda}%' OR localidad LIKE '%${busqueda}%' OR encargado LIKE '%${busqueda}%' OR email LIKE '%${busqueda}%') AND tipo_prov = '${tipo}' `
}

module.exports = {
    getListLimit,
    getCantTotal,
    getList
}