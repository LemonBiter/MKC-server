import express from 'express';

export default function(eventControl) {
    const router = express.Router();

    router.post('/create_event', async (req, res) => {
        try {
            const eventData = req?.body;
            const result = await eventControl.create(eventData);
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
            const id = req.params.id;
            const data = req?.body;
            const result = await eventControl.updateOne(data);
            if (result?.acknowledged) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'update failed!'});
            }

        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const deleteId = req?.params?.id;
            const result = await eventControl.delete(deleteId);
            console.log(result);
            if (result?.acknowledged) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'delete delete!'});
            }
        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });

    router.get('/', async (req, res) => {
        try {
            const {filter, range, sort} = req?.query;
            let q;
            if (filter) {
                q = JSON.parse(filter)?.q;
            }

            const result = await eventControl.fetch();
            let eventArray = (await result.toArray()) || []
            if (q) {
                eventArray = eventArray.filter((each) => each.title.includes(q));
            }
            // const updatedArray = eventArray.map((event, index) => {
            //     event.index = index + 1
            //     return event;
            // });
            // .reverse();
            return res.status(200).send({success: true, data: eventArray});
        } catch (e) {
            console.log(e);
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });

    return router;
}