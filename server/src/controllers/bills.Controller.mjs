import sql from "mssql";
import { poolPromise } from "../config/db.js";


const getBills = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`
                SELECT 
                    b.id,
                    b.houseId,
                    b.month,
                    b.billType,
                    b.amount,
                    b.status,
                    b.dueDate,
                    b.description,
                    b.createdAt,
                    h.block,
                    h.houseNumber,
                    h.houseType,
                    r.name
                FROM Bills b 
                JOIN Houses h ON b.houseId = h.id
                LEFT JOIN Residents r ON h.id = r.houseId AND r.role IN ('owner', 'admin')
                ORDER BY b.dueDate DESC
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
const getBillById = async (req, res) => {
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
            .query(`select * from Bills where id = @id`);
        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
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

const updateBill = async (req, res) => {
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

        const query = `update Bills SET ${setClause} where id = @id`;

        const result = await request.query(query);
        res.status(200).json({ rowsAffected: result.rowsAffected });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const createBill = async (req, res) => {
    try {
        const { houseId, month, billType, amount, status, dueDate, description } = req.body;
        if (!houseId || !month || !billType || !amount || !status || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("houseId", sql.Int, houseId)
            .input("month", sql.VarChar(50), month)
            .input("billType", sql.VarChar(50), billType)
            .input("amount", sql.Decimal(10, 2), amount)
            .input("status", sql.VarChar(20), status)
            .input("dueDate", sql.Date, dueDate)
            .input("description", sql.VarChar(255), description ?? null)
            .query(`
        INSERT INTO Bills
          (houseId, month, billType, amount, status, dueDate, description)
        OUTPUT INSERTED.id
        VALUES
          (@houseId, @month, @billType, @amount, @status, @dueDate, @description)
      `);

        res.status(201).json({
            success: true,
            message: "Bill created successfully",
            billId: result.recordset[0].id
        });

    } catch (error) {
        console.error("Create bill error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
const deleteBill = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        } const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM Bills WHERE id = @id`);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Bill deleted successfully"
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



export { getBills, getBillById, updateBill, createBill, deleteBill };