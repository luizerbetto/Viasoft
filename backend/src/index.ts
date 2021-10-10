import mongoose, { Error } from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import User from './User'
import Message from './Message'
import dotenv from 'dotenv';
import { UserInterface, DatabaseUserInterface } from './Interfaces/UserInterface';
import { MessageInterface, DatabaseMessageInterface } from './Interfaces/MessageInterface';

const LocalStrategy = passportLocal.Strategy

mongoose.connect("mongodb+srv://viasof-user:viasoft123@cluster0.x61nd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    
}, (err : Error) => {
    if(err) throw err;
    console.log("Connect to Moongose");
})

// Middleware
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Passport 
passport.use(new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: Error, user: DatabaseUserInterface) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err: Error, result: boolean) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
  );
  
  passport.serializeUser((user: DatabaseUserInterface, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id: string, cb) => {
    User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
      const userInformation: UserInterface = {
        username: user.username,
        isAdmin: user.isAdmin,
        id: user._id
      };
      cb(err, userInformation);
    });
  });

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req?.body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      res.send("Improper Values");
      return;
    }

    User.findOne({ username }, async (err: Error, doc: DatabaseUserInterface) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("success")
      }
    })    
  });


app.post('/registerMessage', async (req, res) => {
    const { nameSender, nameReceiver, message} = req?.body;

    if (!nameSender || !nameReceiver ) {
      res.send("Improper Values");
      return;
    }

    User.findOne({ username: nameSender }, async (err: Error, doc: DatabaseUserInterface) => {
      if (err) throw err;
      if (!doc) {
        res.send("Remente Não Cadastrado");
        return;
      }
    }) 

    User.findOne({ username: nameReceiver }, async (err: Error, doc: DatabaseUserInterface) => {
      if (err) throw err;
      if (!doc) {
        res.send("Destinatario Não Existe");
        return;
      }
    })
    
    let dateNow = new Date();

    const newMessage = new Message({
      nameSender: nameSender, 
      nameReceiver: nameReceiver, 
      message,
      date: dateNow
    });
    await newMessage.save();
    res.send("success")

  });

  app.post("/login", passport.authenticate("local"), (req, res) => {
    res.send("success")
  });

  app.get("/user", (req, res) => {
    res.send(req.user);
  });

  app.get("/userAll", (req, res) => {
    User.find({}, function(err, data){
      res.send(data);
    });
  });

  app.get("/messages", (req, res) => {
    Message.find({}, function(err, data){
      res.send(data);
    });
  });

  app.get("/messageslist", (req, res) => {
    const  name = req?.query.name;
    Message.find({nameSender: name}, function(err, data){
      res.send(data);
    });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.send("success")
  });


  app.listen(4000, () => {
    console.log("Server Started");
  });