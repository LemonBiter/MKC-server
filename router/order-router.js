import express, {query} from 'express';
import orderController from '../controller/order.js'
import accessoryControl from "../controller/accessory.js";
import materialControl from "../controller/material.js";
const router = express.Router();


router.post('/create_order', async (req, res) => {
    try {
        const orderData = req?.body;
        const result = await orderController.createOrder(orderData);
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
        const id = req.params.id;
        const orderData = req?.body;
        const { from } = req?.query;
        // update new note
        if (from === 'update_note') {
            const result = await orderController.updateNote(id, orderData?.newNote);
            if (result?.acknowledged) {
                return res.status(200).send({ success: true, data: result });
            } else {
                return res.status(200).send({ success: false, message: 'add note failed!' });
            }
        } else if (from === 'edit_page') {
            const result = await orderController.updateOne(id, orderData);
            if (result?.acknowledged) {
                return res.status(200).send({ success: true, data: result });
            } else {
                return res.status(200).send({ success: false, message: 'update failed!' });
            }
        } else if (from === 'update_position') {
            // update order's position in the panel
            const result = await orderController.updatePosition(id, orderData?.data);
            if (result?.acknowledged) {
                return res.status(200).send({ success: true, data: result });
            } else {
                return res.status(200).send({ success: false, message: 'update position failed!' });
            }
        }


    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await orderController.findOne(id);
        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const noteId = req.body.noteId;
        if (noteId) {
            const result = await orderController.deleteNote(id, noteId);
            return res.status(200).send({ success: true, data: result });
        } else {
            const result = await orderController.deleteOrder(id);
            return res.status(200).send({ success: true, data: result });
        }

    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const {filter, range, sort} = req.query;

        const result = await orderController.fetchOrder({filter, range, sort});
        const orderArray = await result.toArray() || [];
        return res.status(200).send({ success: true, data: orderArray });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message, data: [] });
    }
});




export default router;