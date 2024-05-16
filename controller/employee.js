import connectDB from "../mongodb/index.js";
import generateShortId from "ssid";
function employeeController (db, io) {
    const employeeDB = db.collection('employee');
    const imageDB = db.collection('image');
    employeeDB.createIndex(
        { "published_date": 1 },
        // { expireAfterSeconds: 10 }
        { expireAfterSeconds: 7776000 }  // 3个月后文档过期
    );
    return {
        create: async (data) => {
            try {
                data.published_date = new Date();
                return await employeeDB.insertOne(data);
            } catch (e) {
                console.log(e);
            }

        },
        fetch: async (id) => {
            if (id) {
                return await employeeDB.findOne({id});
            } else {
                return await employeeDB.find({});
            }

        },
        updateOne: async ({ id, start, end }) => {

            return  await employeeDB.updateOne({id}, {
                $set: {
                    start,
                    end
                }}
            );
        },
        delete: async (idArr) => {
            return await employeeDB.deleteMany({ id: { $in: idArr } });
        },
    }
}

export default employeeController;