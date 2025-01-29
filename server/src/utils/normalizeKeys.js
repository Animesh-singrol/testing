const { camelCase } = require('lodash');

const normalizeKeysToCamelCase = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[camelCase(key)] = obj[key];
    return acc;
  }, {});
};

module.exports = { normalizeKeysToCamelCase };
