const { v4: uuidv4 } = require('uuid');
module.exports = function randomUUid() {
    return uuidv4()
}