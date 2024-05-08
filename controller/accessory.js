import connectDB from "../mongodb/index.js";

function accessoryController (db) {
    const accessoryDB = db.collection('accessory');
    accessoryDB.createIndex(
        {"id": 1},
    );
    return {
        create: async (data) => {
            console.log('called:');
            data.fileExist = !!data?.base64;
            return await accessoryDB.insertOne(data);
        },
        fetch: async () => {
            return await accessoryDB.find({}).project({ base64: 0 });
        },
        getListWithoutFile: async () => {
            return await accessoryDB.find({}).project({ _id: 0, id: 1, detail: 1,  position: 1, count: 1 });
        },
        findOne: async (id) => {
            return await accessoryDB.findOne({id});
        },
        getImg: async (id) => {
            const doc = await accessoryDB.findOne({id});
            return doc?.base64 || '';
        },
        updateOne: async (id, data) => {
            const fileExist = !!data?.base64
            return await accessoryDB.updateOne({ id }, {
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
                return await accessoryDB.deleteOne({ id });
            } catch (e) {
                console.log(e);
            }
        },
        deleteMany: async (idsArr) => {
            try {
                const filter = { id: { $in: idsArr }};
                return await accessoryDB.deleteMany(filter);
            } catch (e) {
                console.log(e);
            }
        },
    }
}



export default accessoryController;