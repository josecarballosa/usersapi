const wrap = fn => (...args) => Promise.resolve(fn(...args)).catch(args[2]);

// args[2] is next;

module.exports = wrap;
