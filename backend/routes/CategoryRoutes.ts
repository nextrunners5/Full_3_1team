import express from "express";
import { getCategories } from "../feature/product/controller/CategoryController";

const router = express.Router();

router.get("/", getCategories);

export default router;
