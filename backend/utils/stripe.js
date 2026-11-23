const Stripe = require("stripe");

let stripe;

// Created on first use, after server.js has loaded STRIPE_SECRET_KEY from the env file.
module.exports = () => (stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY));
