import sql from "mssql";
import { poolPromise } from "../config/db.js";


const houseget = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT * FROM Houses");

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

const housegetById = async (req, res) => {
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
            .query("select * from Houses where id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "House not found"
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

const updateHouseById = async (req, res) => {
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

        const query = `update Houses SET ${setClause} where id = @id`;

        const result = await request.query(query);
        res.status(200).json({ rowsAffected: result.rowsAffected });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const createHouse = async (req, res) => {
    try {
        const { block, houseNumber, houseType, parkingSlotCount, status } = req.body;

        if (!block || !houseNumber || !houseType || !parkingSlotCount || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        // Convert to integers with validation
        const houseNum = parseInt(houseNumber, 10);
        const parkingCount = parseInt(parkingSlotCount, 10);

        if (isNaN(houseNum) || isNaN(parkingCount)) {
            return res.status(400).json({
                success: false,
                message: "House number and parking slots must be valid numbers"
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("block", sql.VarChar, block)
            .input("houseNumber", sql.Int, houseNum)
            .input("houseType", sql.VarChar, houseType)
            .input("parkingSlotCount", sql.Int, parkingCount)
            .input("status", sql.VarChar, status)
            .query("INSERT INTO Houses(block,houseNumber,houseType,parkingSlotCount,status) VALUES (@block,@houseNumber,@houseType,@parkingSlotCount,@status)");

        res.status(201).json({
            success: true,
            message: "House added successfully",
            rowsAffected: result.rowsAffected
        });
    } catch (error) {
        console.error("Error adding house:", error);
        res.status(500).json({
            success: false,
            message: "Server error, try again",
            error: error.message
        });
    }
};

const deleteHouseById = async (req, res) => {
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
                .query("delete from Houses where id =@id");
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
    houseget,
    housegetById,
    updateHouseById,
    createHouse,
    deleteHouseById
};