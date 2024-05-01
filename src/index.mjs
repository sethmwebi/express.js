import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

const app = express();

mongoose
  .connect(
    "mongodb://sethmwebi:sethmwebi@ac-fma7szy-shard-00-00.bqvrkf5.mongodb.net:27017,ac-fma7szy-shard-00-01.bqvrkf5.mongodb.net:27017,ac-fma7szy-shard-00-02.bqvrkf5.mongodb.net:27017/express-tutorial?ssl=true&replicaSet=atlas-jywn5s-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
  )
  .then(() => console.log("connected to database!"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  return response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(request.user);
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    return response.sendStatus(200);
  },
);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
