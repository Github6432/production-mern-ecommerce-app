import fs from "fs";
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';

dotenv.config();

//PAYMENT GATEWAY
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//CREATE PRODUCT CONTROLLELR
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is Required and should be less then 1mb" });
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
};


//GET PRODUCT CONTROLLER
export const getProductColntroller = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            totalProduct: products.length,
            message: 'All Products are find successfully',
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in get products",
        });
    }
}

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: 'Single Product Fetched',
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in get product",
        });
    }
}
// UPDATE PRODUCT METHOD ==>> PUT
export const updateProductController = async (req, res) => {
    try {

        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};


//DELETE PRODUCT
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};


// GET PHOTO
export const getPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while get photo ",
            error,
        });
    }
}

//FILTER PRODUCT
export const filterProductController = async (req, res) => {

    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const product = await productModel.find(args);
        res.status(200).send({
            success: true,
            product
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while filter product ",
            error,
        });
    }
}


//PRODUCT COUNT PRODUCT
export const productCountController = async (req, res) => {

    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while product Count Controller ",
            error,
        });
    }
}


//PRODUCT LIST PAGE
export const productListController = async (req, res) => {
    try {
        const perPage = 3;
        const page = req.params.page ? req.params.page : 1;
        const product = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while product list page Controller ",
            error,
        });
    }
}

//SEARCH PRODUCT
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const product = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        })
            .select("-photo");
        res.status(200).send({
            success: true,
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while product SEARCH Controller ",
            error,
        });
    }
}
//SIMILAR PRODUCT || METHOD GET
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const product = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(4).populate("category");
        res.status(200).send({
            success: true,
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while related product Controller ",
            error,
        });
    }
}
//CATEGORY WISE PRODUCT || METHOD GET
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
};

//PAYMENT GATEWAY API
//TOKEN
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

//Payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => { total += i.price; });
        gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
        function (err, result) {
            if (result) {
                const order = new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                });
                order.save();
                res.json({ ok: true });
            } else {
                res.status(500).send(err);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
