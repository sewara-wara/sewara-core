// Wraps async controllers so rejected promises are forwarded to next(err) automatically
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
