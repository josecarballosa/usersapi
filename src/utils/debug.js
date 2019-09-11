const debug = require('debug');

const NS = 'userapi';

const error = debug(`${NS}:error`); // this writes to stderr (default)

const info = debug(`${NS}:info`);
info.log = console.log.bind(console); // this writes to stdout

module.exports = { info, error };
