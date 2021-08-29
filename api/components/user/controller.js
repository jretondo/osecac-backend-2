const TABLA = 'users'
const err = require('../../../utils/error')
const auth = require('../auth')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }
    const list = () => {
        return store.list(TABLA)
    }

    const get = (id) => {
        return store.get(TABLA, id)
    }

    const upsert = async (body) => {
        const user = {
            name: body.name,
            username: body.username,
            email: body.email
        }

        if (body.id) {
            if (body.password || body.username) {
                await auth.upsert({
                    id: body.id,
                    username: user.username,
                    password: body.password
                }, false)
            }
            user.id = body.id
            return store.update(TABLA, user)
        } else {
            if (body.password || body.username) {
                const result = await store.insert(TABLA, user)
                await auth.upsert({
                    id: result.insertId,
                    username: user.username,
                    password: body.password
                }, true)
                return result
            } else {
                throw err("Faltan las credenciales!", 500)
            }
        }
    }

    return {
        list,
        get,
        upsert
    }
}