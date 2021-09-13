const getUserDataWithAny = (table, user) => {
    return ` SELECT * FROM ${table} WHERE username = '${user}' OR email = '${user}' `
}

module.exports = {
    getUserDataWithAny
}