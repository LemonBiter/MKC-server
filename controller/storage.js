import connectDB from "../mongodb/index.js";
function storageController (db, WebSocket) {
    const storageDB = db.collection('storage');
    const messageDB = db.collection('message');
    storageDB.createIndex(
        { "published_date": 1 },
        // { expireAfterSeconds: 10 }
        { expireAfterSeconds: 2630016 }  // 3个月后文档过期
    );
    return {
        create: async (data) => {
            data.confirm = false;
            data.published_date = new Date();
            const result = await messageDB.insertOne(data);
            const unconfirmed = await messageDB.find({ confirm: false });
            const count = (await unconfirmed?.toArray() || []).length;
            WebSocket.clients.forEach(function each(client) {
                client.send(JSON.stringify({ count }));
            })
            return result;
        },
        fetch: async () => {
            return await storageDB.find({}).sort({ confirm: -1, published_date: 1 }).limit(100);
        },
        fetchUnconfirmedMessage: async () => {
            return await storageDB.find({ confirm: false });
        },
        update: async ({ id, confirm }) => {
            return await storageDB.updateOne({id}, {
                $set: {
                    confirm
                }})
        },
    }
}

export default storageController;