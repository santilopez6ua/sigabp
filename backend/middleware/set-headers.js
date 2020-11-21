const { response } = require('express');

const setHeaders = (req, res = response, next) => {

    res.header('X-Content-Type-Options', 'nosniff');
    next();
}

module.exports = { setHeaders }