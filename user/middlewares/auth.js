const messageTemplate = require("../util/messageTemplate")
var aadhaarValidator = require('aadhaar-validator')
const db = require('../util/mysql/connection.js')
const uuid = require("../util/uuid")
db.initilize()
const validateMobileNumber = async(req, res, next) => {
    const mobileNumber = req.body.mobileNumber
    console.log(mobileNumber)
    const template = messageTemplate.getTemplate()
    if (mobileNumber == undefined || mobileNumber == null || mobileNumber.length != 10 || isNaN(mobileNumber) == true) {
        template.error = true;
        template.status = 400;
        template.message = "Invalid Mobile Number"
        return res.status(400).json(template)
    };
    if (parseInt(mobileNumber[0]) < 6) {
        template.error = true;
        template.status = 400;
        template.message = "Invalid Mobile Number"
        return res.status(400).json(template);
    }
    const pool = db.getPool()
    const result = await db.callQuery('select id from voter where mobilenumber=' + pool.escape(mobileNumber) + ' AND aadhaarnumber=' + pool.escape(req.body.aadhaarNumber))
    if (result.length == 0) {
        template.error = true;
        template.status = 400;
        template.message = "Mobile Number not registered"
        return res.status(400).json(template);
    }
    var ip = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    console.log(result)
    const sessionId = uuid()
    const sendOtp = require('./sendOtp');
    const tokenquery = 'insert into usertokens(id,ip,userid) values(' + pool.escape(sessionId) + ',' + pool.escape(ip) + ',' + pool.escape(result[0].id) + ')'
    try {
        const insertmessage = await db.callQuery(tokenquery)
        await sendOtp(`+91${mobileNumber}`, ` Aaadhaar number :${req.body.aadhaarNumber} otp is :${sessionId}`)
    } catch (e) {
        console.log(e)
    }
    res.status(200).cookie("userToken", result, {
        httpOnly: false,
        secure: true,
        sameSite: "strict"
    })
    next()
}
const validateAadhaarNumber = async(req, res, next) => {
    const template = messageTemplate.getTemplate()
    const aadhaarNumber = req.body.aadhaarNumber
        // if (aadhaarValidator.isValidNumber(aadhaarNumber) == true) {
    const pool = db.getPool()
    const result = await db.callQuery('select id from voter where aadhaarnumber=' + pool.escape(aadhaarNumber))
    if (result.length == 0) {
        template.error = true;
        template.status = 400;
        template.message = "Aadhaar Number not registered"
        return res.status(400).json(template);
    }
    next()
        // } else {

    // }
}
const sessionChecker = async(req, res, next) => {
    const sessionId = req.cookies.userToken;
    const otp = req.body.otp;
    if (sessionId == undefined || sessionId == null || sessionId == 0 || otp == undefined || otp == null)
        return res.status(302).redirect('/signin')
    const pool = db.getPool()
    const queryResult = await db.callQuery('select id from usertokens where userid=' + pool.escape(sessionId) + ' AND unix_timestamp(current_timestamp)-unix_timestamp(time)<=185 AND id=' + pool.escape(otp));
    console.log(queryResult)
    if (queryResult.length == 0)
        return res.status(302).redirect('/signin')
    res.status(200).cookie("userSessionToken", queryResult, {
        httpOnly: false,
        secure: true,
        sameSite: "strict"
    })
    next()
}
const mainPageSessionChecker = async(req, res, next) => {
    const sessionId = req.cookies.userSessionToken;
    if (sessionId == undefined || sessionId == null || sessionId == 0)
        return res.status(302).redirect('/signin')
    const queryResult = await db.callQuery('select id from usertokens where id=' + pool.escape(sessionId) + ' AND unix_timestamp(current_timestamp)-unix_timestamp(time)<=3600 ');
    console.log(queryResult)
    if (queryResult.length == 0)
        return res.status(302).redirect('/signin')
    next()
}

const isSignedOut = async(req, res, next) => {
    const sessionId = req.cookies.userToken
    if (sessionId == undefined || sessionId == null || sessionId == 0)
        next()
    else {
        const pool = db.getPool()
        const queryResult = await db.callQuery('select ip from usertokens where id=' + pool.escape(sessionId) + ' AND unix_timestamp(current_timestamp)-unix_timestamp(time)<=135')
        if (queryResult.length != 0)
            return res.status(302).redirect("/")
        else {
            next()
        }
    }
}
const signOut = async(req, res, next) => {
    const pool = db.getPool()
    const sessionId = req.cookies.userToken
    const rows = await db.callQuery('select id from usertokens where id=' + pool.escape(sessionId))
    if (rows.length == 1) {
        await db.callQuery('delete from usertokens where id=' + pool.escape(sessionId))
    }
    res.status(200).cookie("userToken", '', {
        httpOnly: false,
        secure: true,
        sameSite: "strict"
    })
    next()
}
module.exports = { validateMobileNumber, validateAadhaarNumber, signOut, isSignedOut, sessionChecker, mainPageSessionChecker }