const { defaultSettings } = require('./default');

// Create a new settings object and copy the default settings into it
const settings = {};
Object.assign(settings, defaultSettings);

module.exports = settings;