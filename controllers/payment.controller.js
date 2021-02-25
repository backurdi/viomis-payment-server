const catchAsync = require("../utils/catch-async");
const dotenv = require("dotenv");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const { v4: uuidv4 } = require("uuid");
const Subscriber = require("../models/subscriber.model");

dotenv.config({ path: "./.env" });

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = process.env.API_KEY;
config.merchantAccount = "ViomisAidECOM";
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);

exports.getPaymentMethods = catchAsync(async (req, res) => {
  console.log(req.query.shopperReference);
  const response = await checkout.paymentMethods({
    channel: "Web",
    merchantAccount: config.merchantAccount,
    allowedPaymentMethods: ["scheme"],
    shopperReference: req.query.shopperReference,
  });

  // Adyen API response is passed to the client
  res.status(200).json({
    title: "Payment methods",
    result: response,
  });
});

// Note the jsonParser instance to help read the bodies of incoming JSON data
exports.makePayment = catchAsync(async (req, res) => {
  const paymentObj = {
    amount: { currency: "EUR", value: 1000 },
    reference: uuidv4(),
    merchantAccount: config.merchantAccount,
    channel: "Web",
    returnUrl: "http://localhost:8080/jaria",
    browserInfo: req.body.browserInfo,
    paymentMethod: req.body.paymentMethod.paymentMethod,
    shopperReference: req.body.shopperReference
      ? req.body.shopperReference
      : uuidv4(),
    shopperInteraction: "ContAuth",
    recurringProcessingModel: "CardOnFile",
  };
  if (req.body.paymentMethod.storePaymentMethod) {
    paymentObj.storePaymentMethod = req.body.paymentMethod.storePaymentMethod;
  }
  const response = await checkout.payments(paymentObj);

  const { resultCode, action } = response;

  if (action?.paymentData) {
    res.cookie("paymentData", action.paymentData);
  }

  console.log(response);
  if (resultCode === "Authorised") {
    res.status(200).json({
      title: "Initiate Payment",
      result: resultCode,
      recurringShopperReference:
        response.additionalData["recurring.shopperReference"],
      shopperReference: response.merchantReference,
    });
  } else if (action) {
    res.status(200).json({
      result: resultCode,
      action,
    });
  }
});

exports.startSubscription = catchAsync(async (req, res) => {
  console.log(req.body.subscriber);
  const subscriber = await Subscriber.create(req.body.subscriber);
  console.log(subscriber);
  const paymentObj = {
    amount: { currency: "EUR", value: 1000 },
    reference: uuidv4(),
    merchantAccount: config.merchantAccount,
    channel: "Web",
    returnUrl: "http://localhost:8080/jaria",
    browserInfo: req.body.paymentData.browserInfo,
    paymentMethod: req.body.paymentData.paymentMethod.paymentMethod,
    shopperReference: subscriber.id,
    storePaymentMethod: true,
    shopperInteraction: "ContAuth",
    recurringProcessingModel: "Subscription",
  };

  const response = await checkout.payments(paymentObj);

  const { resultCode, action } = response;

  if (action?.paymentData) {
    res.cookie("paymentData", action.paymentData);
  }

  if (resultCode === "Authorised") {
    res.status(200).json({
      title: "Initiate Payment",
      result: resultCode,
      recurringShopperReference:
        response.additionalData["recurring.shopperReference"],
      shopperReference: response.merchantReference,
    });
  } else if (action) {
    res.status(200).json({
      result: resultCode,
      action,
    });
  }
});
