/**
 * 환경변수 process.env.NODE_ENV
 * Local 환경 : development / dev.js
 * Deploy 환경 : production / prod.js
 */
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod')
} else {
    module.exports = require('./dev')
}