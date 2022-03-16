/**
 * @module index
 */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/production');
} else {
  module.exports = require('./cjs/development');
}
