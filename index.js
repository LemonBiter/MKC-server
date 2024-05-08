import express from 'express';
import cors from 'cors';
import router from './router/index-router.js';
import dotenv from 'dotenv'
import orderRouter from "./router/order-router.js";
import messageRouter from "./router/message-router.js";
import getConnectDB from "./mongodb/index.js";
import bodyParser from "body-parser";
import materialRouter from "./router/material-router.js";
import accessoryRouter from "./router/accessory-router.js";
import orderControl from './controller/order.js';
import materialControl from './controller/material.js';
import accessoryControl from './controller/accessory.js';
import messageControl from './controller/message.js'

if (process.env.NODE_ENV === 'development') {
   dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'production') {
   dotenv.config({ path: '.env.production' });
}

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

const db = await getConnectDB();
app.use('/order', orderRouter(orderControl(db)));
app.use('/message', messageRouter(messageControl(db)));
app.use('/material', materialRouter(materialControl(db)));
app.use('/accessory', accessoryRouter(accessoryControl(db)));
app.use('/', router);

app.listen(3000, () => {
   console.log('3000 running');
})

export default app;