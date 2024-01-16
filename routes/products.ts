
//this is a dummy rout to test if my api works, will be deleted later
async function test(req: any, res: any) {
    try {
        res.status(200).send({ message: "we are at Products test, server is running" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//Takes only page nom, returns all item count 20- Products 
async function getAllProducts(req: any, res: any) {
    try {
        const categoryName = req.query.category;
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getAllItems",
                categoryName: categoryName,
                pageNumberp: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 
//
async function getProductsByCategory(req: any, res: any) {
    try {
        const categoryName = req.query.category;
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getItemByCategory",
                categoryName: categoryName,
                pageNumber: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 
//
async function getNewArrivalProducts(req: any, res: any) {
    try {
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getNewArrivalProducts",
                pageNumber: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//returns all items rated >4.5 && price<100$ *
async function getHandpickedProducts(req: any, res: any) {
    try {
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getHandpickedProducts",
                pageNumber: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//
async function getHandpickedCategories(req: any, res: any) {
    try {
        const numberOfCategories = req.params.number_of_categories;
        res.status(200).send(
            {
                function: "getHandpickedCategories",
                numberOfCategories: numberOfCategories
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//returns all items of a category rated >4.5 && price<100$ *
async function getHandpickedProductsByCategoryName(req: any, res: any) {
    try {        
        const categoryName=req.query.category;
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getHandpickedProductsByCategoryName",
                categoryName:categoryName,
                pageNumber: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} //less than 20 in stock.
async function getLimitedEditionProducts(req: any, res: any) {
    try {        
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getLimitedEditionProducts",
                pageNumber: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//15% discount
async function getDiscountedProducts(req: any, res: any) {
    try {     
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getDiscountedProducts",
                pageNumber: pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}//search_value
async function getProductsByTextSearch(req: any, res: any) {
    try {     
        const searchValue = req.query.search_value;
        const pageNumber = req.query.page_number;
        res.status(200).send(
            {
                function: "getProductsByTextSearch",
                searchValue: searchValue,
                pageNumber:pageNumber
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 
//returns all product info
async function getProductsById(req: any, res: any) {
    try {     
        const id = Number(req.params.product_id);
        res.status(200).send(
            {
                function: "getProductsById",
                Id: id
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 
// get 5 related products
async function get5RelatedProducts(req: any, res: any) {
    try {     
        const prandId = Number(req.params.brand_id);
        const categoryId = Number(req.params.category_id);
        res.status(200).send(
            {
                function: "get5RelatedProducts",
                prandId: prandId,
                categoryId:categoryId,

            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 
async function getProductsRatings(req: any, res: any) {
    try {     
        const id = Number(req.params.product_id);
        res.status(200).send(
            {
                function: "getProductsRatings",
                Id: id
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 
//
async function getMostPopulurProducts(req: any, res: any) {
    try {     
        const page_number = Number(req.query.page_number);
        res.status(200).send(
            {
                function: "getMostPopulurProducts",
                page_number: page_number
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} 

 
export default {
    test,
    getAllProducts,
    getMostPopulurProducts,
    getProductsByCategory,
    getNewArrivalProducts,
    getHandpickedProducts,
    getHandpickedCategories,
    getHandpickedProductsByCategoryName,
    getLimitedEditionProducts,
    getDiscountedProducts,
    getProductsByTextSearch,
    getProductsById,
    get5RelatedProducts,
    getProductsRatings,
}