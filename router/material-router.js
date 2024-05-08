import express from 'express';

export default function(materialControl) {
    const router = express.Router();

    router.post('/create_material', async (req, res) => {
        try {
            const materialData = req?.body;
            const result = await materialControl.create(materialData);
            if (result?.insertedId) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'create failed!'});
            }
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });
    router.get('/getListWithoutFile', async (req, res) => {
        try {
            const result = await materialControl.getListWithoutFile();
            const materialArray = (await result.toArray()).reverse() || [];
            return res.status(200).send({success: true, data: materialArray});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await materialControl.findOne(id);
            return res.status(200).send({success: true, data: result});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });
    router.get('/get_img/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const base64 = await materialControl.getImg(id);
            return res.status(200).send({success: true, data: base64});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });
    router.put('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const materialData = req?.body;
            const {from} = req?.query;
            if (from === 'update_info') {
                const result = await materialControl.updateOne(id, materialData);
                if (result?.acknowledged) {
                    return res.status(200).send({success: true, data: result});
                } else {
                    return res.status(200).send({success: false, message: 'create failed!'});
                }
            }

        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await materialControl.deleteOne(id);
            if (result?.acknowledged) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'create failed!'});
            }
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });
    router.delete('/', async (req, res) => {
        try {
            const ids = req.query?.filter || '';
            const idsArr = JSON.parse(ids)?.id;

            const result = await materialControl.deleteMany(idsArr);
            if (result?.acknowledged) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'delete failed!'});
            }
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });
    router.get('/', async (req, res) => {
        try {
            const {filter, range, sort} = req?.query;
            const {q} = JSON.parse(filter);
            const result = await materialControl.fetch();
            let materialArray = (await result.toArray()) || []
            if (q) {
                materialArray = materialArray.filter((each) => each.detail.includes(q));
            }
            const updatedArray = materialArray.map((material, index) => {
                material.index = index + 1
                return material;
            }).reverse();
            return res.status(200).send({success: true, data: updatedArray});
        } catch (e) {
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });
    return router;
}