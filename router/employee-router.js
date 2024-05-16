import express from 'express';
import generateShortId from "ssid";

export default function(employeeControl) {
    const router = express.Router();

    router.post('/create_employee', async (req, res) => {
        try {
            const { data: employeeData } = req?.body;
            employeeData.id = generateShortId();
            const result = await employeeControl.create(employeeData);
            if (result?.insertedId) {
                return res.status(200).send({success: true, data: employeeData });
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
            const result = await employeeControl.updateOne(data);
            if (result?.acknowledged) {
                return res.status(200).send({success: true, data: result});
            } else {
                return res.status(200).send({success: false, message: 'update failed!'});
            }

        } catch (e) {
            return res.status(200).send({success: false, message: e.message});
        }
    });

    router.delete('/', async (req, res) => {
        try {
            const filter = req?.query?.filter;
            const { id: idArr } = JSON.parse(filter);

            const result = await employeeControl.delete(idArr);
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

            const result = await employeeControl.fetch();
            let employeeArray = (await result.toArray()) || []
            if (q) {
                employeeArray = employeeArray.filter((each) => each.title.includes(q));
            }
            // const updatedArray = employeeArray.map((employee, index) => {
            //     employee.index = index + 1
            //     return employee;
            // });
            // .reverse();
            return res.status(200).send({success: true, data: employeeArray});
        } catch (e) {
            console.log(e);
            return res.status(200).send({success: false, message: e.message, data: []});
        }
    });

    return router;
}