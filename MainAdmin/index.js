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
const db = require("./util/mysql/connection.js")
db.initilize()
app.use(cookieParser())
app.get("/", (req, res) => {
    res.status(200).render('./main.ejs')
})
app.post("/addPoolAdmin", async(req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const boothnumber = req.body.booth;
    const blockchainaddress = req.body.poolAdminAddress;
    const pool = db.getPool()
    const list = await db.callQuery(`select * from admin where username=` + pool.escape(username) + ' Or boothnumber=' + pool.escape(boothnumber) + 'Or blockchainaddress=' + pool.escape(blockchainaddress));
    const mess = require("./util/messageTemplate.js")
    if (list.length != 0) {
        mess.error = true;
        mess.status = 400;
        mess.message = 'username or booth number or blockchain address already registered'
        return res.status(400).send(mess);
    }
    const insertQuery = 'insert into admin(name,username,boothnumber,password,blockchainaddress) values(' + pool.escape(name) + ',' + pool.escape(username) + ',' + pool.escape(boothnumber) + ',' + pool.escape('abcd1234&') + ',' + pool.escape(blockchainaddress) + ')';
    await db.callQuery(insertQuery);
    mess.message = 'Success';
    mess.error = false;
    mess.status = 200
    return res.status(200).send(mess);
})
app.listen(port, (err) => {
    if (!err)
        console.log(`server listening at port no: ${port}   ......`)
    else
        throw err
})