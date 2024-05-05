import express from 'express';
import messageCountrol from '../controller/message.js'
import materialControl from "../controller/material.js";
const router = express.Router();

router.post('/create_message', async (req, res) => {
    try {
        const materialData = req?.body;
        const result = await messageCountrol.create(materialData);
        if (result?.insertedId) {
            return res.status(200).send({ success: true, data: result });
        } else {
            return res.status(200).send({ success: false, message: 'create failed!' });
        }
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = req?.body;
        const result = await messageCountrol.update(data);
        if (result?.acknowledged) {
            return res.status(200).send({ success: true, data: result });
        } else {
            return res.status(200).send({ success: false, message: 'create failed!' });
        }

    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.get('/get_unconfirmed_message', async (req, res) => {
    try {
        const result = await messageCountrol.fetchUnconfirmedMessage();
        const count = ((await result.toArray()||[])?.length) || 0;
        return res.status(200).send({ success: true, data: count });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message, data: [] });
    }
});
router.get('/', async (req, res) => {
    try {
        const result = await messageCountrol.fetch();
        const messageArray = ((await result.toArray()).reverse()) || []
        return res.status(200).send({ success: true, data: messageArray });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message, data: [] });
    }
});

export default router;