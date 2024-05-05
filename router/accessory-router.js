import express from 'express';
import accessoryControl from '../controller/accessory.js'
const router = express.Router();


router.post('/create_accessory', async (req, res) => {
    try {
        const accessoryData = req?.body;
        const result = await accessoryControl.create(accessoryData);
        if (result?.insertedId) {
            return res.status(200).send({ success: true, data: result });
        } else {
            return res.status(200).send({ success: false, message: 'create failed!' });
        }
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.get('/getListWithoutFile', async (req, res) => {
    try {
        const result = await accessoryControl.getListWithoutFile();
        const accessoryArray = (await result.toArray()).reverse() || [];
        return res.status(200).send({ success: true, data: accessoryArray });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message, data: [] });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await accessoryControl.findOne(id);
        return res.status(200).send({ success: true, data: result });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.get('/get_img/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const base64 = await accessoryControl.getImg(id);
        return res.status(200).send({ success: true, data: base64 });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const accessoryData = req?.body;
        const { from } = req?.query;
        if (from === 'update_info') {
            const result = await accessoryControl.updateOne(id, accessoryData);
            if (result?.acknowledged) {
                return res.status(200).send({ success: true, data: result });
            } else {
                return res.status(200).send({ success: false, message: 'create failed!' });
            }
        }

    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await accessoryControl.deleteOne(id);
        if (result?.acknowledged) {
            return res.status(200).send({ success: true, data: result });
        } else {
            return res.status(200).send({ success: false, message: 'create failed!' });
        }
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        const ids = req.query?.filter || '';
        const idsArr = JSON.parse(ids)?.id;

        const result = await accessoryControl.deleteMany(idsArr);
        if (result?.acknowledged) {
            return res.status(200).send({ success: true, data: result });
        } else {
            return res.status(200).send({ success: false, message: 'delete failed!' });
        }
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message });
    }
});



router.get('/', async (req, res) => {
    try {
        const {filter, range, sort } = req?.query;
        const {q} = JSON.parse(filter);
        const result = await accessoryControl.fetch();
        let accessoryArray = (await result.toArray()) || []
        if (q) {
            accessoryArray = accessoryArray.filter((each) => each.detail.includes(q));
        }
        const updatedArray = accessoryArray.map((accessory, index) => {
            accessory.index = index + 1
            return accessory;
        }).reverse();
        return res.status(200).send({ success: true, data: updatedArray });
    } catch (e) {
        return res.status(200).send({ success: false, message: e.message, data: [] });
    }
});




export default router;