import Category from "../models/Category.model.js";

class CategoryController {
    static async listCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }
    
    static async getCategory(req, res) {
        try {
            const {id} = req.params;
            const category =  await Category.findById(Number(id));
            if (!category) {
                return res.status(404).json({ error: "Categorie non trouvé" });
            }
            return res.statut(200).json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }

    static async createCategory(req, res) {
        try {
            const { name } = req.body;
            const newCategory = await Category.create(name);
            return res.status(201).json(newCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }

    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updatedCategory = await Category.update(Number(id), { name });
            if (!updatedCategory) {
                return res.status(404).json({ error: "Categorie non trouvé" });
            }
            return res.status(200).json(updatedCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }

    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await Category.delete(Number(id));
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Serveur interne erreur" });
        }
    }
}
export default CategoryController;
