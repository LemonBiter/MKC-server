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


if (process.env.NODE_ENV === 'development') {
   dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'production') {
   dotenv.config({ path: '.env.production' });
}
const db = await getConnectDB();
console.log(db, 'ddbb');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));


app.use('/order', orderRouter);
app.use('/message', messageRouter);
app.use('/material', materialRouter);
app.use('/accessory', accessoryRouter);
app.use('/', router);

app.listen(3000, () => {
   console.log('3000 running');
})

export default app;