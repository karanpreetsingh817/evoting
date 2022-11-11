const express = require("express")
const path = require("path")
const port = 1000
const app = express()
const cookieParser = require('cookie-parser')
require("dotenv").config()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "client"))
app.use(express.static(path.join(__dirname, "./client")));
app.use(express.static(path.join(__dirname, "./client/js")));
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: "50000"
}));
app.use(cookieParser())
app.get("/", (req, res) => {
    res.status(200).render('./main.ejs')
})
app.listen(port, (err) => {
    if (!err)
        console.log(`server listening at port no: ${port}   ......`)
    else
        throw err
})