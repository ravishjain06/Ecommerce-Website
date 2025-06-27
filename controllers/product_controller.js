import { Product } from "../models/product_schema.js";
import { User } from "../models/user_schema.js";
import imagekit from "../utils/imagekit.js";
import fs from "fs";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, rating, size, category, inStock, brandName } = req.body; // Added inStock
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
                user: userId, // Fix: use 'user' not 'userId'
                brandName
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments();
        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            success: true,
            products,
            pagination: {
                currentPage: page,
                totalProducts,
                totalPages,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductById = async (req, res) => {
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

export const filterProducts = async (req, res) => {
    try {
        const { 
            clothing, 
            category, 
            search, 
            brandName, 
            minPrice, 
            maxPrice, 
            page = 1, 
            limit = 10 
        } = req.query;
        
        // Build the query object (AND logic)
        const query = {};

        // 1. Clothing filter (partial, case-insensitive)
        if (clothing) {
            const clothingArr = clothing.split(',').map(c => c.trim());
            query.clothing = { $in: clothingArr.map(c => new RegExp(c, 'i')) };
        }

        // 2. Category filter (partial, case-insensitive)
        if (category) {
            const categoryArr = category.split(',').map(c => c.trim());
            query.category = { $in: categoryArr.map(cat => new RegExp(cat, 'i')) };
        }

        // 3. Brand name filter
        if (brandName) {
            const brands = brandName.split(',').map(b => b.trim());
            query.brandName = { $in: brands.map(b => new RegExp(b, 'i')) };
        }

        // 4. Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        // 5. Search filter (search in name, description, brandName)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brandName: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(query);

        // Fetch products
        const products = await Product.find(query)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Check if products found
        if (!products || products.length === 0) {
            return res.status(201).json({
                success: false,
                message: "No products found matching your criteria"
            });
        }

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalProducts,
                    totalPages: Math.ceil(totalProducts / parseInt(limit)),
                    limit: parseInt(limit),
                    hasNextPage: page < Math.ceil(totalProducts / parseInt(limit)),
                    hasPrevPage: page > 1
                },
                filters: {
                    clothing: clothing || null,
                    category: category || null,
                    brandName: brandName || null,
                    minPrice: minPrice || null,
                    maxPrice: maxPrice || null,
                    search: search || null
                }
            }
        });

    } catch (error) {
        console.error("Error in filterProducts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

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

