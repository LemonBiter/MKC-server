import express from 'express';

export default function (messageControl) {
    const router = express.Router();
    router.post('/create_message', async (req, res) => {
        try {
            const materialData = req?.body;
            const result = await messageControl.create(materialData);
            if (result?.insertedId) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'create failed!'});
            }
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const data = req?.body;
            const result = await messageControl.update(data);
            if (result?.acknowledged) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'create failed!'});
            }

        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });

    router.get('/get_unconfirmed_message', async (req, res) => {
        try {
            const result = await messageControl.fetchUnconfirmedMessage();
            const count = ((await result.toArray() || [])?.length) || 0;
            return res.status(200).send({success: true, data: count});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const id = req?.params?.id;
            const result = await messageControl.fetch(id);
            return res.status(200).send({success: true, data: result});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    router.get('/', async (req, res) => {
        try {
            const result = await messageControl.fetch();
            const messageArray = (await result.toArray()) || [];
            return res.status(200).send({success: true, data: messageArray});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    return router;
}