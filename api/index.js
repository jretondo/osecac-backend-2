const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require("http")
const socketIo = require("socket.io")

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
const transferencias = require('./components/transferencias/network')
const libroBco = require('./components/libroBcoCba/network')
const prestadores = require('./components/prestadores/network')
const conciliacion = require('./components/conciliacion/network')
const templateView = require('./components/templateView/network')
const proveedores = require('./components/proveedores/network')
const comodato = require('./components/comodato/network')
const reintBenef = require('./components/reintBenef/network')
const ctaSindical = require('./components/ctaSindical/network')
const actividadApp = require('./components/actividadApp/network')
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger.json')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.use(express.static('Archivos'))

const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.io = io;

//ROUTER
app.use('/api/user', user)
app.use('/api/auth', auth)
app.use('/api/permissions', permissions)
app.use('/api/routes', routes)
app.use('/api/extractos', extractos)
app.use('/api/transferencias', transferencias)
app.use('/api/libroBco', libroBco)
app.use('/api/prestadores', prestadores)
app.use('/api/conciliacion', conciliacion)
app.use('/api/proveedores', proveedores)
app.use('/api/ctaSindical', ctaSindical)
app.use('/api/comodato', comodato)
app.use('/api/reintBenef', reintBenef)
app.use('/api/viewsRender', templateView)
app.use('/api/actividadApp', actividadApp)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.use(errors)

io.on("connection", (socket) => {
    console.log("New client connected");
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(config.api.port, () => {
    console.log(`Conectado al puesto ${config.api.port}`)
});