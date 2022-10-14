const mysql = require("mysql")
var db_config = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
}
const db = (function() {
    var pool;
    var instance = null;

    function init() {
        pool = mysql.createPool(db_config);
    }
    return {
        initilize: () => {
            if (instance == null || instance == undefined) {
                instance = new init();
                instance.constructor = null;
            }
            return instance;
        },
        callQuery: async function(param) {
            return new Promise((resolve, reject) => {
                pool.query(param, (e, r) => {
                    if (e) {
                        reject(e)
                    } else
                        resolve(r)
                })
            })
        },
        getPool: () => {
            return pool
        }
    }
})();
module.exports = db