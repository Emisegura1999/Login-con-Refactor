import express from "express";
const exphbs = require ("express-handlebars");
const session = require ("express-session");
const { Server } = require ('socket.io');
const configObject = require("./config/config.js");
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");

const { puerto, session_secret, mongo_url} = configObject;
require("../database.js");

const cartsRouter = require ("./routes/carts.router.js");
const productsRouter = require ("./routes/products.router.js");
const viewsRouter = require ("./routes/views.router.js");
const sessionRouter = require ("./routes/session.router.js");
const userRouter = require ("./routes/user.router.js");
const passport = require ("passport");
const initializePassport = require ("./config/passport.config.js");

const MessageModel = require ("./models/messages.model.js");

const app = express();


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:"secretCoder",
  resave: true,
  saveUninitialized: true,
}))

// Configuración de sesiones
app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: mongo_url,
      ttl: 1 * 24 * 60 * 60  
  })
}));


// Configuración de cookies
app.use(cookieParser());

// Middleware global para logs
app.use((req, res, next) => {
  console.log('Usuario autenticado (global):', req.user);
  next();
});


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
const httpServer = app.listen(puerto, () => {
    console.log(`Escuchando en el puerto: ${puerto}`);
})

// chat del Ecommerce: 

const io = new Server(httpServer);

io.on("connection",  (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async (data) => {

      //Guardo el mensaje en MongoDB: 
      await MessageModel.create(data);
console.log("Mensaje recibido", data)
      const messages = await MessageModel.find();
      console.log(messages);
      io.sockets.emit("messagesLogs", messages);
   
  })
})

// Manejo de eventos de productos
const productService = require("./services/product.service.js");


io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    // Envía array de productos al cliente
    socket.emit("products", await productService.getProducts());

    // Recibe el evento deleteProduct desde el cliente
    socket.on("removeProduct", async (id) => {
        await productService.deleteProduct(id);
        socket.emit("products", await productService.getProducts());
    });

    // Recibe el evento addProduct desde el cliente
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        socket.emit("products", await productManager.getProducts());
    });
});


// Manejo de eventos de carrito
const cartService = require("./services/cart.service.js");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

s
    socket.emit("cart", await cartService.getProductsFromCart());
});

