const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

router.route("/").get(paymentController.getVersion);
router.route("/setup").get(paymentController.setup);
router.route("/getCheckout").post(paymentController.createCheckoutSession);

module.exports = router;