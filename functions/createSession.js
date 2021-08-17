const functions = require("firebase-functions");

const stripe = require("stripe")("sk_test_w5Rr1z87iqq30IbxRKe5ssLO");

const cors = require("cors")({origin: true});

exports.createSesion = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    stripe.checkout.sessions
        .create({
          success_url: "https://192.168.100.9:3100/app/myWallet?payment=success",
          cancel_url: "https://192.168.100.9:3100/app/myWallet?payment=error",
          payment_method_types: ["card"],
          line_items: [{price: request.body.priceId, quantity: 1}],
          mode: "payment",
          customer: request.body.customerId,
        })
        .then((charge) => {
          response.send(charge);
        })
        .catch((error) => {
          console.log(error);
          response.send(error);
          console.log(request.body);
        });
  });
});


