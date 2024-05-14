const express = require ("express");
const exphbs = require ("express-handlebars");
const session = require ("express-session");
const { Server } = require ('socket.io');
const database = require("../database.js")



const cartsRouter = require ("./routes/carts.router.js");
const productsRouter = require ("./routes/products.router.js");
const viewsRouter = require ("./routes/views.router.js");
const sessionRouter = require ("./routes/session.router.js");
const userRouter = require ("./routes/user.router.js");
const passport = require ("passport");
const initializePassport = require ("./config/passport.config.js");

const MessageModel = require ("./models/messages.model.js");

const app = express();
const PUERTO = 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:"secretCoder",
  resave: true,
  saveUninitialized: true,
}))


//Cambios passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);




//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// chat del Ecommerce: 

const io = new Server(httpServer);

io.on("connection",  (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async (data) => {

      //Guardo el mensaje en MongoDB: 
      await MessageModel.create(data);
console.log("Mensaje recibido", data)
      //Obtengo los mensajes de MongoDB y se los paso al cliente: 
      const messages = await MessageModel.find();
      console.log(messages);
      io.sockets.emit("messagesLogs", messages);
   
  })
})

