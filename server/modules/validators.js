const { defaultValidators } = require('./default');

// Create a new validators object and copy the default validators into it
const validators = {};
Object.assign(validators, defaultValidators);

module.exports = validators;