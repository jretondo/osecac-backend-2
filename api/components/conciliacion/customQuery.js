const getTransf = (table, desde, hasta, pend, busqueda, importe, sinCos) => {
    let pendStr = ""
    if (pend) {
        pendStr = `AND conciliado = '0'`
    }
    let palabra = ""
    if (busqueda !== "") {
        palabra = `AND (concepto LIKE '%${busqueda}%' OR descripcion LIKE '%${busqueda}%')`
    }
    let impNumber = 0
    try {
        impNumber = importe
    } catch (error) {
        impNumber = 0
    }
    let impStr = ""
    if (impNumber > 0) {
        impStr = `AND monto = '${impNumber}'`
    }
    let sinCosStr = ""
    if (sinCos) {
        sinCosStr = `AND transf_int <> '1'`
    }
    return ` SELECT * FROM ${table} WHERE fecha >= '${desde}' AND fecha <= '${hasta}' AND id_tipo = '3' ${pendStr} ${palabra} ${impStr} ${sinCosStr} ORDER BY fecha, monto `
}

module.exports = {
    getTransf
}