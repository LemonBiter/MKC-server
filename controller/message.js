import connectDB from "../mongodb/index.js";
const controller =  {
    create: async (data) => {
        const db = await connectDB();
        const messageDB = db.collection('message');
        data.confirm = false;
        data.published_date = new Date();
        return await messageDB.insertOne(data);
    },
    fetch: async () => {
        const db = await connectDB();
        const messageDB = db.collection('message');
        return await messageDB.find({}).sort({ confirm: -1, published_date: 1 }).limit(100);
    },
    fetchUnconfirmedMessage: async () => {
        const db = await connectDB();
        const messageDB = db.collection('message');
        return await messageDB.find({ confirm: false });
    },
    update: async ({ id, confirm }) => {
        const db = await connectDB();
        const messageDB = db.collection('message');
        return await messageDB.updateOne({id}, {
            $set: {
                confirm
            }})
    },
}

export default controller;