import express from 'express';

export default function (storageController) {
    const router = express.Router();
    router.post('/create_storage', async (req, res) => {
        try {
            const materialData = req?.body;
            const result = await storageController.create(materialData);
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
            const result = await storageController.update(data);
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
            const result = await storageController.fetchUnconfirmedMessage();
            const count = ((await result.toArray() || [])?.length) || 0;
            return res.status(200).send({success: true, data: count});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    router.get('/', async (req, res) => {
        try {
            const result = await storageController.fetch();
            const messageArray = ((await result.toArray()).reverse()) || []
            return res.status(200).send({success: true, data: messageArray});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    return router;
}