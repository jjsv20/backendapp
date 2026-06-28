const repository = require("./owner.repository");
const bcrypt = require("../../utils/bcrypt");
const tokenUtils = require("../../utils/crypto")

const createOwner = async ({ ownerName, email, }) => {

    const existing = await repository.findOwnerByEmail(email);

    if (existing) {
        throw new Error(
            "Ya existe un owner con ese correo"
        );
    }

    const temporaryPassword = Math.random().toString(36).slice(-10);

    const passwordHash = await bcrypt.hashPassword(temporaryPassword);

    const owner = await repository.createOwner({
        owner_name: ownerName,
        email,
        password_hash: passwordHash,
    });

    const activationToken = tokenUtils.generateRandomToken();

    await repository.updateActivationToken(
        owner.id,
        activationToken
    );

    return {
        owner,
        temporaryPassword,
        activationToken
    };
};

module.exports = {
    createOwner,
};