"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//this is a dummy rout to test if my api works, will be deleted later
async function test(req, res) {
    try {
        res.status(200).send({ message: "we are at test, server is running" });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.default = {
    test,
};
