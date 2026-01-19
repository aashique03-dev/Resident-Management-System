import sql from "mssql";
import { poolPromise } from "../config/db.js";

// ✅ FIXED: Changed JOIN to LEFT JOIN for Staff
const getRequests = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`
                SELECT r.id, re.name as Requested_By, 
                       s.name as Requested_To, 
                       h.houseNumber as House_Number, 
                       r.type, r.description, r.status, r.priority,
                       r.createdAt
                FROM Requests r 
                JOIN Residents re ON r.residentId = re.id 
                LEFT JOIN Staff s ON r.staffId = s.id
                JOIN Houses h ON re.houseId = h.id
                ORDER BY r.createdAt DESC
            `);
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
};

const getRequestById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query(`SELECT * FROM Requests WHERE id = @id`);
        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }
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
};

// ✅ FIXED: Admin assigns staff and sets priority
const updateRequest = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { staffId, status, priority } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .input("staffId", sql.Int, staffId)
            .input("status", sql.VarChar(50), status)
            .input("priority", sql.VarChar(50), priority)
            .query(`
                UPDATE Requests
                SET staffId = @staffId,
                    status = @status,
                    priority = @priority
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Request assigned successfully"
        });
    } catch (error) {
        console.error("error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM Requests WHERE id = @id`);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Request deleted successfully"
        });
    } catch (error) {
        console.error("error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

export {
    getRequests,
    getRequestById,
    updateRequest,  // ✅ Changed from createRequest
    deleteRequest
};