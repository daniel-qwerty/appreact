const functions = require("firebase-functions");

const cors = require("cors")({origin: true});

exports.test = functions.https.onRequest(
    (request, response) => {
      cors(request, response, () => {
        response.send(`${request.body.lat}, ${request.body.lon}`);
      });
    }
);
