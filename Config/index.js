const { Environment } = require('./environment');

const env = process.env.NODE_ENV || 'development';

const environment = require('./' + env + '.config');

const config = new Environment(environment);

module.exports = config;
