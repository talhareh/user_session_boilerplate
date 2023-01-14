const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const User = require('./models/user');
const redis = require('./config').redis;

const app = express();

app.use(session({
  store: new RedisStore({
    host: redis.host,
    port: redis.port
  }),
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

passport.use(new JWTStrategy({
  jwtFromRequest: req => req.cookies.token,
  secretOrKey: 'secret'
}, (jwtPayload, done) => {
  User.findOne({
    where: {
      id: jwtPayload.id
    }
  }).then(user => {
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

const authController = require('./controllers/auth');

app.post('/register', authController.register);
app.post('/login', authController.login);


app.listen(4000, () => {console.log("App running at 4000")})