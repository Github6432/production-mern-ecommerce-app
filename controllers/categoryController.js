import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";


//Create Category =>> Method: Post
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exisits",
            });
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: "new category created",
            category,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro in create Category",
        });
    }
};


////UPDATE CATEGORY || METHOD PUT
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name)}, { new: true });
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro in update Category",
        });
    }

};

//FIND ALL CATOGORY || METHOD GET
export const categoryController = async(req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Categories List",
            category,
          });       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro in find all Category",
        });
    }
}

//FIND ALL CATOGORY || METHOD GET
export const singleCategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findOne({slug: req.params.slug});
        res.status(200).send({
            success: true,
            message: "Single Categories List",
            category,
          });       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro in find Single Category",
        });
    }
}
//DELETE CATOGORY || METHOD GET
export const deleteSingleCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Single Categories delete",
            category,
          });       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro in delete Single Category",
        });
    }
}