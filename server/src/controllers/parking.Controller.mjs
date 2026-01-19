import sql from "mssql";
import { poolPromise } from "../config/db.js";


const getParking = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`select p.id,h.houseNumber,p.slotNumber,
                p.vehicleType,p.vehicleNumber,p.status from Parking p
                join Houses h on p.houseId=h.id`);
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

const getParkingById = async (req, res) => {
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
            .query("SELECT * FROM Parking WHERE id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Parking not found"
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

const updateParking = async (req, res) => {
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

        const query = `UPDATE Parking SET ${setClause} WHERE id = @id`;

        const result = await request.query(query);
        res.status(200).json({ rowsAffected: result.rowsAffected });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const createParking = async (req, res) => {
    try {
        const { houseId, slotNumber, vehicleType, vehicleNumber, status } = req.body
        if (!slotNumber || !vehicleType || !vehicleNumber || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }
        const pool = await poolPromise;
        const result =
            await pool.request()
                .input("houseId", sql.Int, houseId)
                .input("slotNumber", sql.VarChar, slotNumber)
                .input("vehicleType", sql.VarChar, vehicleType)
                .input("vehicleNumber", sql.VarChar, vehicleNumber)
                .input("status", sql.VarChar, status)
                .query(`insert into Parking(houseId,slotNumber,vehicleType,vehicleNumber,status) 
                        values (@houseId,@slotNumber,@vehicleType,@vehicleNumber,@status)`);
        res.status(200).json(result.rowsAffected)
    } catch (error) {
        res.status(500).json(error.message)
    }
};
const deleteParking = async (req, res) => {
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
                .query("delete from Parking where id =@id");
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
    getParking,
    getParkingById,
    updateParking,
    createParking,
    deleteParking
};