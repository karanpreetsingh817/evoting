const messageTemplate = require("../util/messageTemplate")
const validateMobileNumber = (req, res, next) => {
    const mobileNumber = req.body.mobileNumber
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
    next();
}

module.exports = validateMobileNumber