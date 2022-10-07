const express = require("express")
const path = require("path")
const app = express()
require("dotenv").config()
const cookieParser = require("cookie-parser")
const middleware = require("./middlewares/signInSessionChecker.js")
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "view"))
app.use(express.static(path.join(__dirname, "./view")));
app.use(express.static(path.join(__dirname, "./view/js")));
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: "50000"
}));
const port = process.env.port || 1500;
app.get("/", middleware, (req, res) => {
    return res.status(200).render('adminlogin')
})
app.post("/adminsignin", require('./middlewares/signInChecker'), async(req, res) => {
    const template = require('./util/messageTemplate').getTemplate()
    template.message = 'Admin sign in successfully'
    template.status = 200
    return res.status(200).send(template)

})

app.listen(port, (err) => {
    if (!err)
        console.log(`server listening at port no: ${port}   ......`)
    else
        throw err
})