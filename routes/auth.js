const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const auth = require("../middlewares/AuthMiddleware");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/register-owner", AuthController.registerOwner)
router.post("/login-owner", AuthController.loginOwner)

router.get ("/me",         auth, AuthController.me);
router.put ("/update",     auth, AuthController.update);
router.post("/push-token", auth, AuthController.savePushToken);

// ─── Direcciones (requieren token) ────────────────────────────────────────────
router.get ("/addresses",              auth, AuthController.getAddresses);
router.put ("/addresses/:id/default",  auth, AuthController.setDefaultAddress);
router.delete("/addresses/:id",        auth, AuthController.deleteAddress);

router.get ("/favorites", auth, AuthController.getFavorites);
router.post ("/favorites/toggle", auth, AuthController.toggleFavorite);


// ─── Autenticación por WhatsApp (Nuevas Rutas) ───────────────────────────────
router.post("/send-otp", AuthController.sendOtpWhatsapp);
router.post("/verify-otp", AuthController.verifyOtpWhatsapp);

router.post("/verify-firebase", AuthController.verifyFirebaseOtp);

module.exports = router;