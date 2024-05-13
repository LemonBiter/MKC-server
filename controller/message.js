import connectDB from "../mongodb/index.js";
function messageController (db, io) {
    const messageDB = db.collection('message');
    messageDB.createIndex(
        { "published_date": 1 },
        // { expireAfterSeconds: 10 }
        { expireAfterSeconds: 7776000 }  // 3个月后文档过期
    );
    return {
        create: async (data) => {
            data.confirm = false;
            data.published_date = new Date();
            const result = await messageDB.insertOne(data);
            const unconfirmed = await messageDB.find({ confirm: false });
            const count = (await unconfirmed?.toArray() || []).length;
            io.emit('updateMessage', JSON.stringify({ count }));
            return result;
        },
        fetch: async (id) => {
            if (id) {
                return await messageDB.findOne({id});
            } else {
                // io.emit('updateMessage', JSON.stringify({ count }));
                return await messageDB.find({}).sort({ confirm: 1, published_date: -1 }).limit(50).project({base64: 0});
            }

        },
        fetchUnconfirmedMessage: async () => {
            return await messageDB.find({ confirm: false });
        },
        update: async ({ id, confirm }) => {
            const result = await messageDB.updateOne({id}, {
                $set: {
                    confirm
                }}
            );
            const unconfirmed = await messageDB.find({ confirm: false });
            const count = (await unconfirmed?.toArray() || []).length;
            io.emit('updateMessage', JSON.stringify({ count }));
            return result;
        },
    }
}

export default messageController;