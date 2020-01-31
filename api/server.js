const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

// Saves session info in database
const knexSessionStore = require('connect-session-knex')(session);
const dbConfig = require('../database/dbConfig');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// sessions use cookies for authZ
server.use(session({
  resave: false, // keep it false to avoid recreating sessions that have not changed.
  saveUninitialized: false, // GDPR laws against setting cookies automatically
  secret: process.env.SECRET || "Keep it secret, keep it safe!", // to cryptographically sign the cookie, want in dotenv file instead
  cookie: {
    httpOnly: true,  // cannot access the cookie from JS - more secure
    // maxAge: 1000 * 10, // expire the session after 10 seconds
    maxAge: 1000 * 60 * 60 * 24 * 7, // expire the session in a week
    secure: false, // in production, this should be true so the cookie header is encrypted
  },
  store: new knexSessionStore({
    knex: dbConfig, // configured instance of knex
    createTable: true, // If the table does not exsist in the db, create it automatically
  })
}));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  console.log(req.headers);
  res.json({ api: 'up' });
});

server.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong"
  })
})

module.exports = server;
