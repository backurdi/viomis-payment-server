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
  const { lineItems, intend, mode } = req.body;
  const sessionBody = {
    mode: mode ? mode : "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: "http://localhost:8080/",
    cancel_url: "http://localhost:8080/",
  };
  if (!mode) {
    sessionBody.payment_intent_data = { description: intend };
  } else {
  }

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create(sessionBody);

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

exports.jaria = catchAsync(async (req, res, next) => {
  let prices = await stripe.prices.list({ limit: 100 });

  prices = prices.data.filter((product) => product.type === "recurring");

  for (let i = 0; i < prices.length; i++) {
    console.log(prices[i].product);
    const retrievedProduct = await stripe.products.retrieve(prices[i].product);
    console.log(retrievedProduct);
    prices[i].name = retrievedProduct.name;
    prices[i].description = retrievedProduct.description;
  }

  // await prices.forEach(async (price, index, pricesArr) => {
  //   const retrievedProduct =
  //   console.log(retrievedProduct.name);
  //   pricesArr[index].name = await retrievedProduct.name;
  // });

  res.status(200).json({
    message: "Success",
    data: prices,
  });
});
