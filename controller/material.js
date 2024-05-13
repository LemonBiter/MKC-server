import connectDB from "../mongodb/index.js";

function materialController (db) {
    const materialDB = db.collection('material');
    const imageDB = db.collection('image');
    materialDB.createIndex(
        { "id": 1 },
    );
    return {
        create: async (data) => {
            return await materialDB.insertOne(data);
        },
        fetch: async () => {
            return await materialDB.find({});
        },
        getListWithoutFile: async () => {
            return await materialDB.find({}).project({ _id: 0, id: 1, detail: 1,  position: 1, count: 1 });
        },
        findOne: async (id) => {
            return await materialDB.findOne({id});
        },
        getImg: async (id) => {
            const doc = await materialDB.findOne({id});
            return doc?.base64 || '';
        },
        updateOne: async (id, data) => {
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
                const m = await materialDB.findOne({id});
                if (m?.fileId) {
                    await imageDB.deleteOne({ fileId: m?.fileId });
                }
                return await materialDB.deleteOne({ id });
            } catch (e) {
                console.log(e);
            }
        },
        deleteMany: async (idsArr) => {
            try {
                const filter = { id: { $in: idsArr }};
                return await materialDB.deleteMany(filter);
            } catch (e) {
                console.log(e);
            }
        },
    }
}


export default materialController;