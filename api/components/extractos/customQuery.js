const insertNewMov = (table, values) => {
    let query = ` INSERT INTO ${table} (fecha,  concepto, nro_cbte, monto, id_tipo, cr_deb, conciliado, id_libro, id_usu, saldo_ini, descripcion) VALUES ${values} `
    query = query.replace(",,,", "")
    query = query.trimRight()
    query = query.slice(0, parseInt(query.length) - 1)
    return query
}

const singleValueNewMov = (tableTMov, fecha, concepto, nroCbte, valor, smConcepto, credito, idUsu, descripcion) => {
    return ` ('${fecha}', '${concepto}', '${nroCbte}', '${valor}', (SELECT orden as Ord FROM ${tableTMov} WHERE desc_extracto LIKE '${smConcepto}' LIMIT 1), ${credito}, '0', '0', ${idUsu}, '0', '${descripcion}') `
}

const listExtractos = (desde, hasta, pagAct) => {
    const desdePag = ((parseInt(pagAct) - 1) * 10)

    if (desde && hasta) {
        return ` SELECT fecha as fecha1,ROUND (SUM(monto), 2) AS movDia, (SELECT ROUND(SUM(monto), 2) AS suma FROM extractos_bco_cba where fecha <= fecha1) as saldoFinal, (SELECT ROUND(SUM(monto), 2) AS suma FROM extractos_bco_cba where fecha < fecha1) AS saldoIni FROM extractos_bco_cba WHERE fecha >= '${desde}' AND fecha <= '${hasta}'  AND saldo_ini = 0 GROUP BY fecha ORDER BY fecha DESC LIMIT ${desdePag}, 10 `
    } else {
        return ` SELECT fecha as fecha1,ROUND (SUM(monto), 2) AS movDia, (SELECT ROUND(SUM(monto), 2) AS suma FROM extractos_bco_cba where fecha <= fecha1) as saldoFinal, (SELECT ROUND(SUM(monto), 2) AS suma FROM extractos_bco_cba where fecha < fecha1) AS saldoIni FROM extractos_bco_cba WHERE saldo_ini = 0 GROUP BY fecha ORDER BY fecha DESC LIMIT ${desdePag}, 10 `
    }
}

const cantExtractos = (desde, hasta) => {
    if (desde && hasta) {
        return ` SELECT COUNT(*) AS CANT FROM extractos_bco_cba WHERE saldo_ini = 0 AND fecha >= ${desde} AND fecha <= ${hasta} `
    } else {
        return ` SELECT COUNT(*) AS CANT FROM extractos_bco_cba WHERE saldo_ini = 0 `
    }
}

const saldoInicial = (desde) => {
    return ` SELECT sum(monto) AS saldoIni, MAX(fecha) AS fechaAnt FROM extractos_bco_cba WHERE fecha < '${desde}' `
}

const movimientosBco = (desde, hasta) => {
    return ` SELECT * FROM extractos_bco_cba WHERE fecha >= '${desde}' AND fecha <= '${hasta}' AND saldo_ini = 0 ORDER BY fecha, id_tipo, nro_cbte, concepto ASC `
}

const totalGastos = (desde, hasta) => {
    return ` SELECT SUM(monto) AS gastos FROM extractos_bco_cba WHERE fecha >= '${desde}' AND fecha <= '${hasta}' AND id_tipo = 7 `
}

const totalImpuestos = (desde, hasta) => {
    return ` SELECT SUM(monto) AS impuestos FROM extractos_bco_cba WHERE fecha >= '${desde}' AND fecha <= '${hasta}' AND (id_tipo = 8 OR id_tipo = 9) `
}

module.exports = {
    insertNewMov,
    singleValueNewMov,
    listExtractos,
    cantExtractos,
    saldoInicial,
    movimientosBco,
    totalGastos,
    totalImpuestos
}