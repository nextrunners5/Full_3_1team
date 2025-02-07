import { Router } from "express";
import upload from "../middlewares/multer";
import {uploadImages} from "../feature/product/img/productImageController"

const router = Router();

// 이미지 업로드 API
router.post("/upload", upload.fields([{ name: "mainImage" }, { name: "detailImage" }]), uploadImages);

export default router;