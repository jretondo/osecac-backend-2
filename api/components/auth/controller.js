const auth = require('../../../auth')
const bcrypt = require('bcrypt')
const TABLA = 'auth'

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const upsert = async (data, isNew) => {
        const authData = {
            id: data.id
        }

        if (data.username) {
            authData.username = data.username
        }

        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5)
        }
        if (isNew) {
            store.insert(TABLA, authData)
        } else {
            store.update(TABLA, authData)
        }
    }

    const login = async (username, password) => {
        const data = await store.query(TABLA, { username: username })
        console.log(`data`, data)
        return bcrypt.compare(password, data.password)
            .then(same => {
                if (same) {
                    return auth.sign(JSON.stringify(data))
                } else {
                    throw new Error('información invalida')
                }
            })
    }

    return {
        upsert,
        login
    }
}