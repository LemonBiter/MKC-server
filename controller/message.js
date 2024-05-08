import connectDB from "../mongodb/index.js";
function messageController (db) {
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
            return await messageDB.insertOne(data);
        },
        fetch: async () => {
            return await messageDB.find({}).sort({ confirm: -1, published_date: 1 }).limit(100);
        },
        fetchUnconfirmedMessage: async () => {
            return await messageDB.find({ confirm: false });
        },
        update: async ({ id, confirm }) => {
            return await messageDB.updateOne({id}, {
                $set: {
                    confirm
                }})
        },
    }
}

export default messageController;