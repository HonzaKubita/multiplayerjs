const crypto = require('crypto');

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function checkNameError(name) {
    if (name.length < 1) {
        return "Name must be at least 1 character";
    }
    if (name.length > 20) {
        return "Name must be at most 20 characters";
    }
    return null;
}

module.exports = {
    uuidv4,
    checkNameError
};