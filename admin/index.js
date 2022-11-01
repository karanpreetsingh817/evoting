const express = require("express")
const path = require("path")
const app = express()
require("dotenv").config()
const cookieParser = require("cookie-parser")
const { isSignedOut, signIn, sessionChecker, signOut } = require("./middlewares/auth.js")
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
app.get("/", sessionChecker, (req, res) => {
    return res.status(200).render('main')
})
app.get("/adminsignin", isSignedOut, (req, res) => {
    return res.status(200).render('adminlogin')
})
app.post("/adminsignin", signIn, async(req, res) => {
    res.status(200).redirect("/")
})
app.get("/adminsignout", signOut, (req, res) => {
    res.status(302).redirect("/adminsignin")
})
app.post("/addVoter", (req, res) => {
    console.log(req.body)
    res.status(302).send("/Done..")
})
app.listen(port, (err) => {
    if (!err)
        console.log(`server listening at port no: ${port}   ......`)
    else
        throw err
})