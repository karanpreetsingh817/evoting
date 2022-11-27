const { v4: uuidv4 } = require('uuid');
module.exports = function randomUUid() {
    return uuidv4().substring(0, 5)
}