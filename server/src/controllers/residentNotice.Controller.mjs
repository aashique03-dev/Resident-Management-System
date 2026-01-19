import sql from "mssql";
import { poolPromise } from "../config/db.js";

const getNotice = async (req, res) => {
    try {
        const id = req.user.id;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID from token"
            });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`
                SELECT n.id, r.name as PostedBy, r.role, n.title,
                    n.description, n.category, n.datePosted 
                FROM Notes n 
                JOIN Residents r ON n.postedBy = r.id
                ORDER BY n.datePosted DESC
            `);

        // ✅ FIXED: Return array, not 404 on empty
        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

export { getNotice };