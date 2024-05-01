import express from 'express';
import { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteSingleCategory } from '../controllers/categoryController.js';
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";

const router = express.Router();

//CREATE CATEGORY || METHOD POST
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
//GET all CATEGORY || METHOD GET
router.get('/all-category', categoryController);
//GET single CATEGORY || METHOD GET
router.get('/single-category/:slug', singleCategoryController);
//UPDATE CATEGORY || METHOD PUT
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
//DELETE CATEGORY || METHOD DELETE
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteSingleCategory);

export default router;