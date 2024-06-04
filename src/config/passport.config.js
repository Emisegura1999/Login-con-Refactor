import ('dotenv').config();
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");
const UserModel = require("../models/user.model");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { createHash, isValidPassword } = require("../utils/hashbcryp");


const cartService = require("../services/cart.service.js");
const CartModel = require("../models/cart.model.js"); 

const initializePassport = () => {
    //Vamos a armar nuestras estrategias: Registro y Login. 

    passport.use("register", new LocalStrategy({
        //Le digo que quiero acceder al objeto request
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            //Verificamos si ya existe un registro con ese email: 
            let usuario = await UserModel.findOne({ email });

            if (usuario) {
                return done(null, false);
            }

            //Si no existe voy a crear un registro de usuario nuevo: 

            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let resultado = await UserModel.create(nuevoUsuario);
            return done(null, resultado);
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia para el "Login".
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            //Primero verifico si existe un usuario con ese email: 
            let usuario = await UserModel.findOne({ email });

            if (!usuario) {
                console.log("Este usuario no existe!");
                return done(null, false);
            }

            //Si existe verifico la contraseña: 
            if (!isValidPassword(password, usuario)) {
                return done(null, false);
            }

            return done(null, usuario);


        } catch (error) {
            return done(error);
        }
    }))


    //Serializar y deserializar: 

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

    //Estrategia para iniciar sesion con google

    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile.emails[0].value });
            if (!user) {
                const newCart = await CartModel.create({ products: [], quantity:0 });
                await newCart.save();
                let newUser = {
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    age: 18,
                    cart: newCart._id,
                    password: createHash('google')
                };
                user = await userModel.create(newUser);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    //Acá generamos la nueva estrategia con GitHub: 

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23lisAbjZtRAAGlgXr",
        clientSecret: "0032f5ee0904164141dbf69b9d33d037607dff15",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Veo los datos del perfil
        console.log("Profile:", profile);

        try {
            let usuario = await UserModel.findOne({ email: profile._json.email });

            if (!usuario) {
                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 36,
                    email: profile._json.email,
                    password: "1234"
                }

                let resultado = await UserModel.create(nuevoUsuario);
                done(null, resultado);
            } else {
                done(null, usuario);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;