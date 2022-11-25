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
const db = require('./util/mysql/connection.js')
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
app.post("/addVoter", async(req, res) => {
    db.initilize();
    const pool = db.getPool();
    const { name, aadhaarnumber, gender, mobilenumber, blockchainaccount } = req.body;
    try {
        await db.callQuery('insert into  voter(name,aadhaarnumber,sex,mobilenumber,blockchainaccount) values(' + pool.escape(name) + ',' + pool.escape(aadhaarnumber) + ',' + pool.escape(gender) + ',' + pool.escape(mobilenumber) + ',' + pool.escape(blockchainaccount) + ')');
        const mess = require('./util/messageTemplate').getTemplate()
        mess.error = false;
        mess.status = 200;
        mess.message = blockchainaccount;
        return res.status(200).send(mess)
    } catch (e) {
        const mess = require('./util/messageTemplate').getTemplate()
        mess.error = true;
        mess.status = 400;
        mess.message = e.message
        return res.status(400).send(mess)
    }

})
app.listen(port, (err) => {
    if (!err)
        console.log(`server listening at port no: ${port}   ......`)
    else
        throw err
})