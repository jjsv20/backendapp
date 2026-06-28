const jwt = require("jsonwebtoken");
const env = require("../config/env");

// ACCESS TOKEN
const generateAccessToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: "access",
        },
        env.JWT_SECRET,
        {
            expiresIn: "15m",
            issuer: "orderfood-api",
            audience: "orderfood-app",
        }
    );
};

// REFRESH TOKEN
const generateRefreshToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: "refresh",
        },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: "30d",
            issuer: "orderfood-api",
            audience: "orderfood-app",
        }
    );
};

// VERIFY ACCESS
const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            env.JWT_SECRET,
            {
                issuer: "orderfood-api",
                audience: "orderfood-app",
            }
        );

        if (decoded.type !== "access") {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
};

// VERIFY REFRESH
const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            env.JWT_REFRESH_SECRET,
            {
                issuer: "orderfood-api",
                audience: "orderfood-app",
            }
        );

        if (decoded.type !== "refresh") {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
};

// VERIFICATION TOKEN (pre-registro)
const generateVerificationToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: "verification",
        },
        env.JWT_SECRET,
        {
            expiresIn: "15m",
            issuer: "orderfood-api",
            audience: "orderfood-app",
        }
    );
};

const verifyVerificationToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            env.JWT_SECRET,
            {
                issuer: "orderfood-api",
                audience: "orderfood-app",
            }
        );

        if (decoded.type !== "verification") {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateVerificationToken,
    verifyVerificationToken
};