import { Product } from "../models/product_schema.js";
import { User } from "../models/user_schema.js";
import imagekit from "../utils/imagekit.js";
import fs from "fs";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, rating, size, category, inStock } = req.body; // Added inStock
        const userId = req.id;
        const files = req.files;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let imageUrls = [];
        for (const file of files) {
            const uploadImage = await imagekit.upload({
                file: file.buffer ? file.buffer : fs.readFileSync(file.path),
                fileName: file.originalname,
                folder: "products"
            });
            imageUrls.push(uploadImage.url);
        }
        try {
            const product = new Product({
                name,
                description,
                price,
                rating,
                image: imageUrls,
                size,
                category,
                inStock, // Pass inStock here
                user: userId // Fix: use 'user' not 'userId'
            });

            await product.save();

            // Update user's product list
            const user = await User.findById(userId);
            if (user) {
                user.Product.push(product);
                await user.save();
            }

            res.status(201).json({ message: "Product created successfully", product });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPorducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProductBytId = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product fetched successfully", product });
    } catch (error) {
        console.log("Error fetching product by ID:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const categoryAndSearch = async (req, res) => {
    try {
        const { category, search } = req.query;
        const query = {};

        if (category) {
            // Check if any product exists with this category (case-insensitive)
            const categoryExists = await Product.exists({
                category: { $regex: category, $options: 'i' }
            });

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: `No products found in category "${category}"`
                });
            }

            query.category = { $regex: category, $options: 'i' };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error("Error in category and search:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, rating, size, category, inStock } = req.body;
        const files = req.files;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (rating) product.rating = rating;
        if (size) product.size = size;
        if (category) product.category = category;
        if (inStock) product.inStock = inStock; // Update inStock
        if (files && files.length > 0) {
            let imageUrls = [];
            for (const file of files) {
                const uploadImage = await imagekit.upload({
                    file: file.buffer ? file.buffer : fs.readFileSync(file.path),
                    fileName: file.originalname,
                    folder: "products"
                });
                imageUrls.push(uploadImage.url);
            }
            product.image = imageUrls; // Update images
        }
        await product.save();
        res.status(200).json({ message: "Product updated successfully", product });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.id;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await User.findById(userId);
        if (user) {
            await User.updateOne(
                {
                    Product: productId
                }
            )

            await user.save();
        }

        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.log("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

