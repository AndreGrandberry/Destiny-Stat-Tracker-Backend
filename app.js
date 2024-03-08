"use strict";

// Express app for destiny_stat-tracker //Backend

require('dotenv').config();

const express = require("express");
const session = require('express-session'); 
const cors = require('cors');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default; // Optional usage in case session isn't working properly 
const { PORT, SECRET_KEY } = require('./config');
const path = require('path');


const authRoutes = require("./routes/auth"); // import routes
const metrics = require("./routes/metrics");
const api = require("./routes/api");



let redisClient = createClient() // Connect to redisClient for the Session workaround
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
  })

const app = express();

app.use(cors());

app.use(session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: SECRET_KEY,
}));



app.use(express.json());



// Routes
app.use("/auth", authRoutes);
app.use("/metrics", metrics);
app.use("/api", api);


// Serve React frontend for the root route
app.use('/', express.static(path.join(__dirname, '../frontend/destiny2-stat-tracker/build')));


  


// 404 handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// General error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: err.status,
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = { app };
