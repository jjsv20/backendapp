const customerResponseMapper = (customer) => {
    return {
        id: customer.id,
        full_name: customer.full_name,
        username: customer.username,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        is_verified: customer.is_verified,
        created_at: customer.created_at,
        updated_at: customer.updated_at
    };
}

module.exports = {
    customerResponseMapper
}