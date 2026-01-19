import sql from "mssql";
import { poolPromise } from "../config/db.js";



const getAllStaff = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("select * from Staff");

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

const getStaffById = async (req, res) => {
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
            .query("select * from Staff where id = @id");

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
        console.error("error:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

const updateStaff = async (req, res) => {
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

        const query = `update Staff set ${setClause} where id = @id`;

        const result = await request.query(query);
        res.status(200).json({ rowsAffected: result.rowsAffected });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const createStaff = async (req, res) => {
    try {
        const { name, contact, role, assignedRequests, } = req.body
        if (!name || !contact || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
        const pool = await poolPromise;
        const result =
            await pool.request()
                .input("name", sql.VarChar, name)
                .input("contact", sql.VarChar, contact)
                .input("role", sql.VarChar, role)
                .input("assignedRequests", sql.Int, assignedRequests)
                .query("insert into Staff(name,contact,role,assignedRequests) values (@name,@contact,@role,@assignedRequests)");
        res.status(200).json(result.rowsAffected)
    } catch (error) {
        res.status(500).json(error.message)
    }
};

const deleteStaff = async (req, res) => {
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
                .query("delete from Staff where id =@id");
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
    getAllStaff,
    getStaffById,
    updateStaff,
    createStaff,
    deleteStaff
};