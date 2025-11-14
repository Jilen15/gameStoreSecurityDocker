import Category from "../models/Category.model.js";

class CategoryController {
    static async listCategories(req, res, next) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (err) {
            next(err);
        }
    }
    
    static async getCategory(req, res, next) {
        try {
            const {id} = req.params;
            const category =  await Category.findById(Number(id));
            if (!category) {
                return res.status(404).json({ error: "Categorie non trouvé" });
            }
            return res.status(200).json(category);
        } catch (err) {
            next(err);
        }
    }

    static async createCategory(req, res, next) {
        try {
            const { name } = req.body;
            const newCategory = await Category.create(name);
            return res.status(201).json(newCategory);
        } catch (err) {
            next(err);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await Category.update(Number(id), { name });
            if (!updatedCategory) {
                return res.status(404).json({ error: "Categorie non trouvé" });
            }
            return res.status(200).json(updatedCategory);
        } catch (err) {
            next(err);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Category.delete(Number(id));

            if (!deleted) return res.status(404).json({ message: "Jeu non trouvé" });

            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}
export default CategoryController;
