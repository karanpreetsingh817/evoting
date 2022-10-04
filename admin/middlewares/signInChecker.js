const db = require('../util/mysql/connection')
const message = require("../util/messageTemplate")
db.initilize()
const app = async(req, res, next) => {
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

        next()
    } catch (e) {
        template.error = true
        template.status = 501
        template.message = 'Internal Server Error'
        return res.status(400).send(template)
    }
}
module.exports = app