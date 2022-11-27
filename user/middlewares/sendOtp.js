const accountSid = process.env.accountSID;
const authToken = process.env.authToken;
require('dotenv').config()
const sendSms = async(phone, message) => {
    const client = require('twilio')(accountSid, authToken);
    const m = await client.messages
        .create({
            body: message,
            from: process.env.phoneNumber,
            to: phone
        })
    console.log(m)

}
module.exports = sendSms;