const catchAsync = require("../utils/catch-async");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getVersion = (req, res)=> {
  res.status(200).json({
      status: 'success',
      data:123
  })
};

exports.setup = (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    "100": process.env.HUNDRED_PRICE_ID,
    "250": process.env.TWOFIFTY_PRICE_ID,
    "500": process.env.FIVE_PRICE_ID,
    "750": process.env.SEVENFIFTY_PRICE_ID,
    "1000": process.env.THOUSAND_PRICE_ID,
    "2500": process.env.TWOTHOUSANDFIVE_PRICE_ID,
    "5000": process.env.FIVETHOUSAND_PRICE_ID,
  });
}

exports.createCheckoutSession = catchAsync(async (req, res) => {
  const { priceId } = req.body;

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: 'https://støtmasjid.dk#/success?session_id=${CHECKOUT_SESSION_ID}',
      cancel_url: 'https://støtmasjid.dk',
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});
