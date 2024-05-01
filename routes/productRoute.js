import express from 'express';
import {
    createProduct,
    deleteProductController,
    filterProductController,
    getPhotoController,
    getProductColntroller,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productListController,
    relatedProductController,
    searchProductController,
    updateProductController,
    braintreePaymentController,
    braintreeTokenController
} from '../controllers/productController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable';


//Router Object
const router = express();

//Routing

//CREATE PRODUCT || METHOD POST
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProduct);
//UPDATE PRODUCT || METHOD GET
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);
//delete PRODUCT || METHOD delete
router.delete('/delete-product/:pid', requireSignIn, isAdmin, formidable(), deleteProductController);
//GET PRODUCTS || METHOD GET
router.get('/all-products', requireSignIn, getProductColntroller);
//GET PRODUCT || METHOD GET
router.get('/get-product/:slug', getSingleProductController);
//GET PHOTO || METHOD GET
router.get('/get-photo/:pid', getPhotoController);
//FILTER PRODUCT || METHOD POST
router.post('/filter-product', filterProductController)
//PRODUCT COUNT || METHOD GET
router.get('/product-count', productCountController)
//PRODUCT SEARCH || METHOD GET
router.get('/search/:keyword', searchProductController)
//PRODUCT PAGE LIST || METHOD GET
router.get('/product-list/:page', productListController)
//SIMILAR PRODUCT || METHOD GET
router.get('/related-product/:pid/:cid', relatedProductController)
//CATEGORY WISE PRODUCT || METHOD GET
router.get('/product-category/:slug', productCategoryController)
//PAYMENT ROUTES
//Token
router.get('/braintree/token', braintreeTokenController)
//Payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)


export default router;