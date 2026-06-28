const repository = require("./address.repository");

const getAddresses = async (userId) => {

    const addresses =
        await repository.getAddressesByUser(userId);

    return {
        addresses,
    };
};

const addAddress = async (userId, payload) => {

    if (payload.is_default) {
        await repository.resetDefaultAddresses(userId);
    }

    const address =
        await repository.createAddress({
            ...payload,
            user_id: userId,
        });

    return {
        address,
    };
};

const updateAddress = async (userId, addressId, payload) => {
    await repository.getAddressById(
        addressId,
        userId
    );

    if (payload.is_default) {
        await repository.resetDefaultAddresses(
            userId
        );
    }

    const address = await repository.updateAddress(
        addressId,
        userId,
        payload
    );

    return {
        address,
    };
};

const removeAddress = async (userId, addressId) => {
    await repository.getAddressById(
        addressId,
        userId
    );

    await repository.deleteAddress(
        addressId,
        userId
    );

    return {
        success: true,
    };
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    removeAddress,
};