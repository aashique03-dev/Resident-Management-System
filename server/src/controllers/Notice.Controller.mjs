import sql from "mssql";
import { poolPromise } from "../config/db.js";


const getAllNotices = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`select n.id,r.name as PostedBy,r.role,n.title,
                n.description,n.category,n.datePosted from Notes n 
                join Residents r on n.postedBy=r.id`);

        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error("error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
}
const getAllNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query(`select n.id,r.name as PostedBy,r.role,n.title,
                n.description,n.category,n.datePosted from Notes n 
                join Residents r on n.postedBy=r.id where n.id = @id`);

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error("error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
}
const updateNotic = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // 1. Ensure there is actually data to update
        const columns = Object.keys(updates);
        if (columns.length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

        const pool = await poolPromise;
        const request = pool.request();
        request.input("id", sql.Int, id);
        const setClause = columns
            .map((col) => {
                request.input(col, updates[col]);
                return `${col} = @${col}`;
            })
            .join(", ");

        const query = `update Notes set ${setClause} where id = @id`;

        const result = await request.query(query);
        res.status(200).json({ rowsAffected: result.rowsAffected });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const createNotic = async (req, res) => {
    try {
        const { postedBy, title, description, category } = req.body
        if (!postedBy || !title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
        const pool = await poolPromise;
        const result =
            await pool.request()
                .input("postedBy", sql.Int, postedBy)
                .input("title", sql.VarChar, title)
                .input("description", sql.VarChar, description)
                .input("category", sql.VarChar, category)
                .input("datePosted", sql.Date, new Date())
                .query("insert into Notes(postedBy,title,description,category,datePosted) values (@postedBy,@title,@description,@category,GETDATE())");
        res.status(200).json(result.rowsAffected)
    } catch (error) {
        res.status(500).json(error.message)
    }
};

const deleteNotic = async (req, res) => {
    try {
        const { id } = req.params
        if (isNaN(id)) {
            return req.status(400).json({
                success: false,
                message: "Invalid id"
            })
        }

        const pool = await poolPromise;
        const result =
            await pool.request()
                .input("id", sql.Int, id)
                .query("delete from Notes where id =@id");
        console.log(result);
        res.status(200).json({
            message: "has been deleted"
        })
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json(error.message)

    }
};


export {
    getAllNotices,
    getAllNoticeById,
    updateNotic,
    createNotic,
    deleteNotic
}