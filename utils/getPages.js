const getPages = (totalReg, cantPerPage, pageAct) => {
    let ultPagina = 1
    let paginas = []

    if (totalReg === 0) {
        return {
            cantTotal: 0,
            totalPag: 0
        }
    } else {
        if (totalReg < cantPerPage) {
            paginas.push(1)
        } else {
            const paginasFloat = parseFloat(totalReg / cantPerPage)
            const paginasInt = parseInt(totalReg / cantPerPage)
            let totalPag
            if (paginasFloat > paginasInt) {
                totalPag = paginasInt + 1
            } else {
                if (paginasInt === 0) {
                    totalPag = 1
                } else {
                    totalPag = paginasInt
                }
            }

            ultPagina = totalPag

            for (let i = 0; i < totalPag; i++) {
                const paginaLista = i + 1
                const limiteInf = pageAct - 3
                const limiteSup = pageAct + 3
                if (paginaLista > limiteInf && paginaLista < limiteSup)
                    paginas.push(paginaLista)
            }
            return {
                cantTotal: paginas,
                totalPag: ultPagina
            }
        }
    }
}

module.exports = getPages