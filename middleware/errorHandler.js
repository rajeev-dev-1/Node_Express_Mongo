const {logEvents} = require('./logEvents');
const errorLogger = (err, req, res, next)=>{
    console.log(err.stack);
    logEvents(`${err.message}\t${err.name}`,'errorLog.txt');
    res.status(500).send(err.message);
}
module.exports = errorLogger;