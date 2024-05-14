const mongoose = require ("mongoose");

mongoose.connect("mongodb+srv://emisegura99:Rodolfo99@cluster0.vnw9mtk.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
 .then(() => console.log("Conectado a la base de datos"))
 .catch((error) => console.log("Tenemos un error", error))