
//this is a dummy rout to test if my api works, will be deleted later
async function test(req: any, res: any) {
    try {
        res.status(200).send({ message: "we are at Brands test, server is running" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllBrands(req: any, res: any) {
    try {
        res.status(200).send(
            {
                function: "getAllBrands",
                
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export default {
    test,
    getAllBrands,
}