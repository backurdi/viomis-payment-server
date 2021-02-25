const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "subscriber need a name"],
  },
  email: {
    type: String,
    required: [true, "subscriber need a email"],
  },
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
