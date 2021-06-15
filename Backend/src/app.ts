import "reflect-metadata";
import { useContainer, Action, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { MongoServer } from "./mongo.server";
import * as Dotenv from 'dotenv';
import { SecurityHelper } from "./common/security.helper";
import { ErrorHandler } from "./middlewares/errorHandler";
import express = require("express");
import { TempUserSessionRepository } from "./repository/tempUserSessionRepository";

// Controllers 
import { TestController } from "./controllers/TestController";
import { AuthController } from "./controllers/AuthController";
import { UserProfileController } from "./controllers/UserProfileController";
import { VerifyController } from "./controllers/VerifyController";
import { RateLimiter } from "./middlewares/throttleMiddleware";


// Path env file
Dotenv.config({ path: `${process.env.NODE_ENV || ''}.env` });

// Rate limiter (Doc: https://www.npmjs.com/package/limiter#usage)
const rateLimiter = require('limiter').RateLimiter;
const limiter = new rateLimiter(process.env.THROTTLE_LIMIT_PER_HOUR, 'hour', true);
const { promisify } = require('util');
RateLimiter.removeTokens = promisify(limiter.removeTokens).bind(limiter);


/**
 * Setup routing-controllers to use typedi container.
 */
useContainer(Container);

// Connect to mongo
new MongoServer().connect();

// Authorization
var tempUserSessionRepository = new TempUserSessionRepository();
var authorization = async (action: Action) => {

    // Get and check if exists
    let _token = action.request.headers["authorization"];
    if (!_token)
        return false;

    // Validate token and set payload in header
    let _payload = SecurityHelper.validateToken(_token);
    if (_payload == null)
        return false;

    var session = await tempUserSessionRepository.findUserSessionByIdAsync(_payload.userId);
    if (session == null || session.token != _token.split("Bearer ")[1])
        return false;

    action.request.headers.payload = _payload;

    // Return true for valid users
    return true;
}

/**
 * We create a new express server instance.
 * We could have also use useExpressServer here to attach controllers to an existing express instance.
 */
const app: express.Express = require("express")();
const server = require("http").Server(app);



app.get('/', (req, res) => res.send('Success'));

// Configure view engine
var hbs = require('express-handlebars');
app.engine('handlebars', hbs({
    defaultLayout: 'layout',
    helpers: {
        toJSON: (object: any) => {
            return JSON.stringify(object);
        }
    }
}));
app.set('view engine', 'handlebars');

useExpressServer(app, {
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    authorizationChecker: authorization,
    validation: true,
    controllers: [
        TestController,
        AuthController,
        UserProfileController,
        VerifyController,
    ],
    routePrefix: "/api",
    defaultErrorHandler: true,
    middlewares: [ErrorHandler]
});

/**
 * Start the express app.
 */
app.use(express.static('images'));
server.listen(process.env.PORT);

console.log(`Server is up and running at port ${process.env.PORT}`);