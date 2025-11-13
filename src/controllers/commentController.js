import Comment from "../models/comment.model.js";

class CommentController {
    static async listComments(req, res, next) {
        try {
            const comments = await Comment.findAll();
            res.json(comments);
        } catch (err) {
            next(err);
        }
    }
    
    static async getComment(req, res, next) {
        try {
            const {id} = req.params;
            const comment =  await Comment.findById(Number(id));
            if (!comment) {
                return res.status(404).json({ error: "Commentaire non trouvé" });
            }
            return res.statut(200).json(comment);
        } catch (err) {
            next(err);
        }
    }

    static async createComment(req, res, next) {
        try {
            const { content, note, type } = req.body;
            const newComment = await Comment.create(content, note, type);
            return res.status(201).json(newComment);
        } catch (err) {
            next(err);
        }
    }

    static async updateComment(req, res, next) {
        try {
            const { id } = req.params;
            const { content, note, type } = req.body;
            const updatedComment = await Comment.update(Number(id), { content, note, type });
            if (!updatedComment) {
                return res.status(404).json({ error: "Commentaire non trouvé" });
            }
            return res.status(200).json(updatedComment);
        } catch (err) {
            next(err);
        }
    }

    static async deleteComment(req, res, next) {
        try {
            const { id } = req.params;
            await Comment.delete(Number(id));
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}
export default CommentController;

