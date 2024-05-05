import connectDB from "../mongodb/index.js";
import generateShortId from "ssid";

const controller =  {
    createOrder: async (data) => {
        const db = await connectDB();
        const orderDB = db.collection('order');
        const count = await orderDB.find({})?.toArray();
        const noteId = generateShortId();
        // data.index = count.length;
        if (data?.additional) {
            data.additional = [{ noteId, value: data.additional, noteTime: new Date() }];
        }
        return await orderDB.insertOne(data);
    },
    updateOne: async (id, data) => {
        const db = await connectDB();
        const orderDB = db.collection('order');
        console.log('data: roomInfo', data.roomInfo)
        return await orderDB.updateOne({ id }, {
            $set: {
                additional: data?.additional || '',
                address: data?.address || '',
                city: data?.city || '',
                email: data?.email || '',
                name: data?.name || '',
                phone: data?.phone|| '',
                roomInfo: data?.roomInfo|| {},
                stateAbbr: data?.stateAbbr || '',
                zipcode: data?.zipcode || ''
            }
        }, {
            upsert: true
        });
    },
    updatePosition: async (id, { index, stage }) => {
        const db = await connectDB();
        const orderDB = db.collection('order');
        const updateObj = {};
        if (index) updateObj.index = index;
        if (stage) updateObj.stage = stage;
        return await orderDB.updateOne({ id }, {
            $set: updateObj
        }, {
            upsert: true
        });
    },
    updateNote: async (id, newNote) => {
        const db = await connectDB();
        const orderDB = db.collection('order');
        const existed = await orderDB.findOne({id});
        const noteId = generateShortId();
        let noteArray = [];
        const newNoteObj = { noteId, value: newNote, noteTime: new Date() };
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
        const db = await connectDB();
        const orderDB = db.collection('order');
        const selected = await orderDB.findOne({id});
        const newNoteList = selected.additional.filter((note) => {
            return note.noteId !== noteId;
        });
        return await orderDB.updateOne({ id }, {
            $set: { additional: newNoteList }
        });
    },
    deleteOrder: async (id) => {
        const db = await connectDB();
        const orderDB = db.collection('order');
        return await orderDB.deleteOne({id});
    },
    fetchOrder: async ({filter, range, sort}) => {
        const db = await connectDB();
        const orderDB = db.collection('order');
        const f = JSON.parse(filter);
        if (f?.stage) {
            return await orderDB.find(f);
        }
        return await orderDB.find({});
    },
    findOne: async (id) => {
        const db = await connectDB();
        const materialDB = db.collection('order');
        return await materialDB.findOne({id});
    },
}

export default controller;