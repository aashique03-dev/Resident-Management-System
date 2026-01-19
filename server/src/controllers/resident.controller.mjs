import sql from "mssql";
import { poolPromise } from "../config/db.js";



const getResident = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`select r.id,r.name,r.contact,r.email,r.cnic,r.role,
                h.houseNumber,h.houseType,h.parkingSlotCount 
                from Residents r join Houses h on r.houseId=h.id`);
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

const getResidentById = async (req, res) => {
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
            .query("SELECT * FROM Residents WHERE id = @id");

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

const updateResident = async (req, res) => {
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

        const query = `UPDATE Residents SET ${setClause} WHERE id = @id`;

        const result = await request.query(query);
        res.status(200).json({ rowsAffected: result.rowsAffected });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const createResident = async (req, res) => {
    try {
        const { houseId, name, cnic, contact, email, password, role } = req.body
        if (!name || !cnic || !contact || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
        const pool = await poolPromise;
        const result =
            await pool.request()
                .input("houseId", sql.Int, houseId)
                .input("name", sql.VarChar, name)
                .input("cnic", sql.VarChar, cnic)
                .input("contact", sql.VarChar, contact)
                .input("email", sql.VarChar, email)
                .input("password", sql.VarChar, password)
                .input("role", sql.VarChar, role)
                .query("insert into Residents(houseId,name,cnic,contact,email,password,role)  values (@houseId,@name,@cnic,@contact,@email,@password,@role)");
        res.status(200).json(result.rowsAffected)
    } catch (error) {
        res.status(500).json(error.message)
    }
};
const deleteResident = async (req, res) => {
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
                .query("delete from Residents where id =@id");
        console.log(result);
        res.status(200).json({
            message: "has been deleted"
        })
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json(error.message)

    }
}

export {
    getResident,
    getResidentById,
    updateResident,
    createResident,
    deleteResident
};