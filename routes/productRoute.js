const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
  deleteImages,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImages");
const router = express.Router();

router.get("/", getAllProduct);
router.post("/new-product", authMiddleware, isAdmin, createProduct);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);
router.get("/:id", getProduct);

router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
