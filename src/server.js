import app from "./app.js";
import https from "https";
import fs from "fs";

//Utilisation du certificat et de la clé privée
const options = {
  key: fs.readFileSync("certs_api/localhost+2-key.pem"),
  cert: fs.readFileSync("certs_api/localhost+2.pem"),
};

https.createServer(options, app).listen(3000, () => {
  console.log("HTTPS actif sur https://localhost:3000");
});