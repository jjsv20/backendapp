const { application } = require("express");
const repository = require("./application.repository");
const mailer = require("../../config/mailer");
const ownerService = require("../../modules/restaunrants/owner.service")
const restaurantService = require("../../modules/restaunrants/restaurant.service")

const createApplication = async (userId, payload) => {
    const application = await repository.createApplication({ ...payload, user_id: userId, });

    try {
        await mailer.newRestaurantApplication({
            restaurantName: application.restaurant_name,
            ownerName: application.owner_name,
            restaurantEmail: application.business_email,
            restaurantPhone: application.restaurant_phone,
            city: application.city,
            notes: application.notes,
        });
    } catch (err) {
        console.error("Error notificando al administrador:", err);
    };

    return {
        application,
    };
};

const getPendingApplications = async () => {

    const applications = await repository.getPendingApplications();

    return {
        applications,
    };
};

const approveAplication = async (applicationId) => {
    const application = await repository.updateApplications(applicationId, "approved");

    const ownerData = await ownerService.createOwner({
        ownerName: application.owner_name,
        email: application.business_email,
    });

    const restaurant = await restaurantService.createRestaurant({
        ownerId: ownerData.owner.id,
        name: application.restaurant_name,
        phone: application.restaurant_phone
    })

    return {
        application,
        owner: ownerData.owner,
        restaurant
    };
}

const rejectApplication = async (applicationId) => {
    const application = await repository.updateApplications(applicationId, "rejected");

    return {
        application,
    };
};

const getMyApplication = async(userId) => {
    const application = await repository.getMyApplication(userId);
    return {
        application,
    };
};

module.exports = {
    createApplication,
    getPendingApplications,
    getMyApplication,
    approveAplication,
    rejectApplication
};