import "reflect-metadata"
import express from 'express';
import { errorHandler } from './utils/errorHandler';
import serveless from '@codegenie/serverless-express'
import { customerRouter } from "./infrastructure/http/express/router/customer.router";

import pinoHttp from 'pino-http'
import logger from "./infrastructure/library/pino";
import { priceRouter } from "./infrastructure/http/express/router/price.router";
import { listRoutes } from "./utils/listRoutes";
import { subscriptionRouter } from "./infrastructure/http/express/router/subscription.router";
import { productRouter } from "./infrastructure/http/express/router/product.router";
import { APIGatewayEvent } from "aws-lambda";
import CustomerController from "./app/controllers/customer.controller";
import { awsLogger } from "./infrastructure/library/awsLogger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';

import { Logger } from '@aws-lambda-powertools/logger';
import { OPTIONS_EVENTS } from "./config/constants";
import { creditsRouter } from "./infrastructure/http/express/router/credits.router";
import { paymentRouter } from "./infrastructure/http/express/router/payment.router";
const enviromment = process.env.ENVIROMMENT

const app = express();

app.use(pinoHttp({
    logger: logger
}))

app.use(express.json())

//routes
app.use(`/${enviromment}/credits`, creditsRouter)
app.use(`/${enviromment}/customer`, customerRouter)
app.use(`/${enviromment}/price`, priceRouter)
app.use(`/${enviromment}/subscription`, subscriptionRouter)
app.use(`/${enviromment}/product`, productRouter)
app.use(`/${enviromment}/payment`, paymentRouter)

app.get(`/${enviromment}`, (req, res) => {
    res.status(201).send({ success: true })
})


//middlewares
app.use(errorHandler)

//development routes
/* app.listen(3000, () => {
    console.log('listening onn http://localhost:3000')
    listRoutes(app);
}) */


module.exports.handler = serveless({ app })
