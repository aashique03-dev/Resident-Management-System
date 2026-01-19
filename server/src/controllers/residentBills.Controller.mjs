import sql from "mssql";
import { poolPromise } from "../config/db.js";

const getMybills = async (req, res) => {
  try {
    const userId = req.user.id;
    
   

    if (!userId || isNaN(userId)) {
      console.log("❌ Invalid user ID");
      return res.status(400).json({
        success: false,
        message: "Invalid user ID from token",
      });
    }

    const pool = await poolPromise;

    // 1️⃣ Get houseId from the database using userId
    const userResult = await pool
      .request()
      .input("id", sql.Int, userId)
      .query("SELECT id, houseId, name FROM Residents WHERE id = @id");

   
    const houseId = userResult.recordset[0]?.houseId;
  
    if (!houseId) {
      console.log("❌ No house found for user");
      return res.status(404).json({
        success: false,
        message: "House not found for this user",
      });
    }

    // 2️⃣ Fetch all bills for this house
    const billsResult = await pool
      .request()
      .input("houseId", sql.Int, houseId)
      .query(`
        SELECT 
          b.id, b.houseId, b.month, b.billType, b.amount, b.status, b.dueDate, 
          b.description, b.createdAt, h.block, h.houseNumber, h.houseType 
        FROM Bills b 
        JOIN Houses h ON b.houseId = h.id 
        WHERE b.houseId = @houseId 
        ORDER BY b.dueDate DESC
      `);

    
    res.status(200).json({
      success: true,
      data: billsResult.recordset,
    });
  } catch (error) {
    console.error("❌ ERROR fetching bills:", error);
    console.error("❌ ERROR stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
};

export { getMybills };