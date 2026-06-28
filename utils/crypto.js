const crypto = require("crypto");

// RANDOM TOKEN
const generateRandomToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// 6 DIGIT SECURE CODE
const generateSixDigitCode = () => {
    return crypto.randomInt(
        100000,
        999999
    ).toString();
};

// HASH TOKENS
const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

module.exports = {
    generateRandomToken,
    generateSixDigitCode,
    hashToken,
};