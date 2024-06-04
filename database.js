import mongoose from "mongoose";
import configObject from "./src/config/config.js"

mongoose.connect(configObject.mongo_url)
 .then(() => console.log("Conectado a la base de datos"))
 .catch((error) => console.log("Tenemos un error", error))