import express from 'express';
import multer from "multer";
import {Binary} from "mongodb";

export default function (imageController) {
    const router = express.Router();
    const upload = multer({ storage: multer.memoryStorage() });
    router.post('/create_image', upload.single('image'), async (req, res) => {
        try {
            const imageDoc = {
                fileId: req.body.fileId,
                contentType: req.file.mimetype,
                from: req.body.from || 'unknown',
                image: new Binary(req.file.buffer)
            };
            const result = await imageController.create(imageDoc);
            if (result?.insertedId) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'create failed!'});
            }
            return res.status(200)
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });
    router.get('/:fileId', async (req, res) => {
        try {
            const fileId = req?.params?.fileId;
            const result = await imageController.fetch(fileId);
            res.end(result?.image?.buffer);
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: null });
        }
    });
    router.put('/:fileId', upload.single('image'), async (req, res) => {
        try {
            const fileId = req?.params?.fileId;
            const imageDoc = {
                fileId,
                contentType: req.file.mimetype,
                image: new Binary(req.file.buffer)
            };
            const result = await imageController.update(fileId, imageDoc);
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
            const result = await imageController.fetchUnconfirmedMessage();
            const count = ((await result.toArray() || [])?.length) || 0;
            return res.status(200).send({success: true, data: count});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });

    return router;
}