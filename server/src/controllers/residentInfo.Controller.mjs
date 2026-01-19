import sql from "mssql";
import { poolPromise } from "../config/db.js";

const getResidentInfoById = async (req, res) => {
    try {
        // ✅ Get ID from JWT token instead of URL parameter
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
                SELECT  r.id, r.name, r.cnic, r.contact,  r.email,
                    r.role,  h.block, h.houseNumber, h.houseType, h.parkingSlotCount 
                FROM Residents r 
                JOIN Houses h ON r.houseId = h.id 
                WHERE r.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Error fetching resident info:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

export { getResidentInfoById };