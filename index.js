import express from 'express';
import cors from 'cors';
import router from './router/index-router.js';
import dotenv from 'dotenv'
import http from 'http';
import { WebSocketServer } from 'ws';
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
import imageControl from './controller/image.js'
import storageRouter from "./router/storage-router.js";
import storageControl from './controller/storage.js'
import imageRouter from "./router/image-router.js";
import {Server} from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';



if (process.env.NODE_ENV === 'development') {
   dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'production') {
   dotenv.config({ path: '.env.production' });
}

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));



const io = new Server(8080, {
   cors: {
      origin: ['http://localhost:5173', "http://13.237.249.81"]
   }
});

io.on('connection', (socket) => {
   console.log('socket connected');
})




const db = await getConnectDB();
app.use('/order', orderRouter(orderControl(db)));
app.use('/message', messageRouter(messageControl(db, io)));
app.use('/material', materialRouter(materialControl(db)));
app.use('/accessory', accessoryRouter(accessoryControl(db)));
app.use('/image', imageRouter(imageControl(db)));
app.use('/storage', storageRouter(storageControl(db, io)));
app.use('/', router);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // 提供静态文件
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(3000, () => {
   console.log('3000 running');
})

export default app;