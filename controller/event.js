import connectDB from "../mongodb/index.js";
function eventController (db, io) {
    const eventDB = db.collection('event');
    const imageDB = db.collection('image');
    eventDB.createIndex(
        { "published_date": 1 },
        // { expireAfterSeconds: 10 }
        { expireAfterSeconds: 7776000 }  // 3个月后文档过期
    );
    return {
        create: async (data) => {
            try {
                data.published_date = new Date();
                const { start } = data;
                const [year, month, day] = start.split('-');
                data.year = parseInt(year);
                data.month = parseInt(month);
                data.day = parseInt(day);
                return await eventDB.insertOne(data);
            } catch (e) {
                console.log(e);
            }

        },
        fetch: async (id) => {
            if (id) {
                return await eventDB.findOne({id});
            } else {
                return await eventDB.find({});
            }

        },
        updateOne: async ({ id, start, end }) => {

            return  await eventDB.updateOne({id}, {
                $set: {
                    start,
                    end
                }}
            );
        },
        delete: async (deleteId) => {
            return await eventDB.deleteOne({ id: deleteId });
        },
    }
}

export default eventController;