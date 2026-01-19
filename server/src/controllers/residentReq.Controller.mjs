import sql from "mssql";
import { poolPromise } from "../config/db.js";

const getReq = async (req, res) => {
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
            .input("id", sql.Int, id)
            .query(`
                SELECT r.id, r.type, r.description, r.status, r.priority, r.createdAt,
                    rr.name as RequestedBy,
                    s.name as RequestedTo  
                FROM Requests r
                JOIN Residents rr ON r.residentId = rr.id
                LEFT JOIN Staff s ON r.staffId = s.id 
                WHERE r.residentId = @id
                ORDER BY r.createdAt DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

const getReqById = async (req, res) => {
    try {
        const residentId = req.user.id;
        const requestId = Number(req.params.id);

        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, requestId)
            .input("residentId", sql.Int, residentId)
            .query(`
                SELECT * FROM Requests 
                WHERE id = @id AND residentId = @residentId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not allowed"
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

// ✅ FIXED: Resident can only set type and description
const addReq = async (req, res) => {
    try {
        const residentId = req.user.id;
        const { type, description } = req.body;

        if (!type || !description) {
            return res.status(400).json({
                success: false,
                message: "Type and description are required"
            });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("residentId", sql.Int, residentId)
            .input("type", sql.VarChar(50), type)
            .input("description", sql.VarChar(255), description)
            .query(`
                INSERT INTO Requests (residentId, type, description, status, priority)
                OUTPUT INSERTED.id
                VALUES (@residentId, @type, @description, 'pending', 'normal')
            `);

        res.status(201).json({
            success: true,
            message: "Request created successfully",
            requestId: result.recordset[0].id
        });

    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

// ✅ FIXED: Resident can only update type and description (not priority)
const updateReq = async (req, res) => {
    try {
        const residentId = req.user.id;
        const requestId = Number(req.params.id);
        const { type, description } = req.body;

        if (isNaN(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID"
            });
        }

        if (!type || !description) {
            return res.status(400).json({
                success: false,
                message: "Type and description are required"
            });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, requestId)
            .input("residentId", sql.Int, residentId)
            .input("type", sql.VarChar(50), type)
            .input("description", sql.VarChar(255), description)
            .query(`
                UPDATE Requests
                SET type = @type,
                    description = @description
                WHERE id = @id AND residentId = @residentId
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not allowed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Request updated successfully"
        });

    } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

export {
    getReq,
    getReqById,
    addReq,
    updateReq
};