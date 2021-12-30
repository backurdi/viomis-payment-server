const catchAsync = require("../utils/catch-async");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getVersion = (req, res) => {
  res.status(200).json({
    status: "success",
    data: 123,
  });
};

exports.createCheckoutSession = catchAsync(async (req, res) => {
  const { lineItems, intend } = req.body;

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      payment_intent_data: { description: intend },
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: "http://localhost:8080/",
      cancel_url: "http://localhost:8080/",
    });

    res.send({
      sessionId: session.id,
      url: session.url,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
});

exports.products = catchAsync(async (req, res, next) => {
  const products = await stripe.products.list();

  res.status(200).json({
    message: "Success",
    data: products.data,
  });
});
