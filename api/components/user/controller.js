const TABLA = 'users'
const TABLA2 = 'user_follow'
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
            username: body.username
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
            const result = await store.insert(TABLA, user)
            if (body.password || body.username) {
                await auth.upsert({
                    id: result.insertId,
                    username: user.username,
                    password: body.password
                }, true)
            }
            return result
        }
    }

    const follow = async (from, to) => {
        return await store.insert(TABLA2, {
            user_from: from,
            user_to: to
        })
    }

    const following = async (id) => {
        const join = {}
        join[TABLA] = "user_to"
        const query = { user_from: id }
        return await store.query(TABLA2, query, join)
    }
    return {
        list,
        get,
        upsert,
        follow,
        following
    }
}