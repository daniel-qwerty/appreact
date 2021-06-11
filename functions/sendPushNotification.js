const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const axios = require("axios");

exports.sendPushNotification = functions.https.onRequest(
    (request, response) => {
      cors(request, response, () => {
        axios({
          method: "POST",
          url: "https://exp.host/--/api/v2/push/send",
          data: {
            to: request.body.to,
            sound: request.body.sound,
            title: request.body.title,
            body: request.body.body,
            data: request.body.data,
          },
          headers: {
            "Accept": "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        }).then((response) => {
          console.log("credao push");
          console.log(response.data);
          response.send(response.data);
        })
            .catch((error) => {
              console.log(error.response);
              response.send(error.response);
            });
      });
    }
);
