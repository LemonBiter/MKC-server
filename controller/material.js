import connectDB from "../mongodb/index.js";
const controller =  {
    create: async (data) => {
        const db = await connectDB();
        const materialDB = db.collection('material');
        data.fileExist = !!data?.base64;
        return await materialDB.insertOne(data);
    },
    fetch: async () => {
        const db = await connectDB();
        const materialDB = db.collection('material');
        return await materialDB.find({}).project({ base64: 0 });
    },
    getListWithoutFile: async () => {
        const db = await connectDB();
        const materialDB = db.collection('material');
        return await materialDB.find({}).project({ _id: 0, id: 1, detail: 1,  position: 1, count: 1 });
    },
    findOne: async (id) => {
        const db = await connectDB();
        const materialDB = db.collection('material');
        return await materialDB.findOne({id});
    },
    getImg: async (id) => {
        const db = await connectDB();
        const materialDB = db.collection('material');
        const doc = await materialDB.findOne({id});
        return doc?.base64 || '';
    },
    updateOne: async (id, data) => {
        const db = await connectDB();
        const materialDB = db.collection('material');
        const fileExist = !!data?.base64
        return await materialDB.updateOne({ id }, {
            $set: {
                detail: data.detail,
                base64: data?.base64,
                count: data?.count || 0,
                position: data?.position,
                fileExist
            }
        }, {
            upsert: true
        });
    },
    deleteOne: async (id) => {
        try {
            const db = await connectDB();
            const materialDB = db.collection('material');
            return await materialDB.deleteOne({ id });
        } catch (e) {
            console.log(e);
        }
    },
    deleteMany: async (idsArr) => {
        try {
            const db = await connectDB();
            const materialDB = db.collection('material');
            const filter = { id: { $in: idsArr }};
            return await materialDB.deleteMany(filter);
        } catch (e) {
            console.log(e);
        }
    },
}

export default controller;