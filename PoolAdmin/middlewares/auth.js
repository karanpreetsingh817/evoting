const db = require('../util/mysql/connection')
const message = require("../util/messageTemplate")
const uuid = require("../util/uuid")
db.initilize()
const signIn = async(req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const pool = db.getPool()
    const template = message.getTemplate()
    try {
        const query = 'select * from admin where username=' + pool.escape(username) + ' And password=' + pool.escape(password)
        const data = await db.callQuery(query)
        if (data.length == 0) {
            template.error = true
            template.status = 404
            template.message = 'Invaild username or password'
            return res.status(400).send(template)
        }
        var ip = req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            null;
        const sessionId = uuid()
        const tokenquery = 'insert into admintokens(id,ip) values(' + pool.escape(sessionId) + ',' + pool.escape(ip) + ')'
        const insertmessage = await db.callQuery(tokenquery)
        res.status(200).cookie("adminToken", sessionId, {
            httpOnly: false,
            secure: true,
            sameSite: "strict"
        })
        next()
    } catch (e) {
        template.error = true
        template.status = 501
        template.message = 'Internal Server Error'
        res.status(400).send(template)
        throw e
    }
}
const sessionChecker = async(req, res, next) => {
    const sessionId = req.cookies.adminToken
    if (sessionId == undefined || sessionId == null || sessionId == 0)
        return res.status(302).redirect('/adminsignin')
    const pool = db.getPool()
    const queryResult = await db.callQuery('select ip from admintokens where id=' + pool.escape(sessionId) + ' AND unix_timestamp(current_timestamp)-unix_timestamp(time)<=32400')
    console.log(queryResult)
    if (queryResult.length == 0)
        return res.status(302).redirect('/adminsignin')
    next()

}
const isSignedOut = async(req, res, next) => {
    const sessionId = req.cookies.adminToken
    if (sessionId == undefined || sessionId == null || sessionId == 0)
        next()
    else {
        const pool = db.getPool()
        const queryResult = await db.callQuery('select ip from admintokens where id=' + pool.escape(sessionId) + ' AND unix_timestamp(current_timestamp)-unix_timestamp(time)<=32400')
        if (queryResult.length != 0)
            return res.status(302).redirect("/")
        else {
            next()
        }
    }
}
const signOut = async(req, res, next) => {
    const pool = db.getPool()
    const sessionId = req.cookies.adminToken
    const rows = await db.callQuery('select id from admintokens where id=' + pool.escape(sessionId))
    if (rows.length == 1) {
        await db.callQuery('delete from admintokens where id=' + pool.escape(sessionId))
    }
    res.status(200).cookie("adminToken", '', {
        httpOnly: false,
        secure: true,
        sameSite: "strict"
    })
    next()
}
module.exports = { signIn, sessionChecker, isSignedOut, signOut }