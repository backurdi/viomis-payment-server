const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

router.route("/").get(paymentController.getVersion);
router.route("/products").get(paymentController.products);
router.route("/getCheckout").post(paymentController.createCheckoutSession);

module.exports = router;
