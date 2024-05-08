import connectDB from "../mongodb/index.js";
import generateShortId from "ssid";

function orderController (db) {
    const orderDB = db.collection('order');
    orderDB.createIndex(
        { "published_date": 1 },
        { expireAfterSeconds: 7776000 }  // 3个月后文档过期
    );
    return {
            async createOrder (data) {
                const count = await orderDB.find({})?.toArray();
                const noteId = generateShortId();
                // data.index = count.length;
                if (data?.additional) {
                    data.additional = [{ noteId, value: data.additional, noteTime: new Date() }];
                }
                data.published_date = new Date();
                return await orderDB.insertOne(data);
            },
            async fetchOrder ({filter, range, sort}) {
                console.log('fetch all');
                const orderDB = db.collection('order');
                const f = JSON.parse(filter);
                if (f?.stage) {
                    return await orderDB.find(f);
                }
                return await orderDB.find({}).sort({published_date: -1}).limit(50);
            },
            updateOne: async (id, data) => {
                return await orderDB.updateOne({id}, {
                    $set: {
                        additional: data?.additional || '',
                        address: data?.address || '',
                        email: data?.email || '',
                        name: data?.name || '',
                        phone: data?.phone || '',
                        roomInfo: data?.roomInfo || {},
                        stage: data?.stage || 'ordered'
                    }
                }, {
                    upsert: true
                })
            },
            updatePosition: async (id, { index, stage }) => {
            const updateObj = {};
            if (index) updateObj.index = index;
            if (stage) updateObj.stage = stage;
            return await orderDB.updateOne({ id }, {
                $set: updateObj
            }, {
                upsert: true
            });
        },
            updateNote: async (id, orderData) => {
            const existed = await orderDB.findOne({id});
            const noteId = generateShortId();
            let noteArray = [];
            let newNoteObj;
            if (orderData?.type === 'img') {
                newNoteObj  = { noteId, type: orderData?.type, value: orderData?.base64, noteTime: new Date() };
            } else {
                newNoteObj = { noteId, type: orderData?.type, value: orderData?.newNote, noteTime: new Date() };
            }
            if (existed?.additional) {
                noteArray = [newNoteObj, ...existed.additional]
            } else {
                noteArray = [newNoteObj];
            }
            return await orderDB.updateOne({ id }, {
                $set: {additional: noteArray}
            }, {
                upsert: true
            });

        },
            deleteNote: async (id, noteId) => {
            const selected = await orderDB.findOne({id});
            const newNoteList = selected.additional.filter((note) => {
                return note.noteId !== noteId;
            });
            return await orderDB.updateOne({ id }, {
                $set: { additional: newNoteList }
            });
        },
            deleteOrder: async (id) => {
            return await orderDB.deleteOne({id});
        },
            findOne: async (id) => {
                return await orderDB.findOne({id});
            }
    }
}

export default orderController;
