const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config({
    path: path.join(__dirname, "..", ".env")
})
const errors = require('../network/errors')
const config = require('../config')
const user = require('./components/user/network')
const auth = require('./components/auth/network')
const permissions = require('./components/permissions/network')
const routes = require('./components/routes/network')
const extractos = require('./components/extractos/network')
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger.json')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//ROUTER
app.use('/api/user', user)
app.use('/api/auth', auth)
app.use('/api/permissions', permissions)
app.use('/api/routes', routes)
app.use('/api/extractos', extractos)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(errors)

app.listen(config.api.port, () => {
    console.log(`Conectado al puesto ${config.api.port}`)
})