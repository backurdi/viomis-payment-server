const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

router.route("/getPaymentMethods").get(paymentController.getPaymentMethods);
router.route("/makePayment").post(paymentController.makePayment);
router.route("/startSubscription").post(paymentController.startSubscription);

module.exports = router;
