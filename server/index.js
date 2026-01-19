import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRouter from "./src/routers/authRouters..js";
import ResidentRouter from "./src/routers/residentRouters.js";
import HousesRouter from "./src/routers/houseRouters.js";
import StaffRouter from "./src/routers/staffRouter.js";
import BillRouter from "./src/routers/billRouter.js";
import RequestRouter from "./src/routers/requestRouter.js";
import NoticesRouter from "./src/routers/noticeRouter.js";
import ParkingRouter from "./src/routers/parkingRouter.js";
import ResidentRouterInfo from "./src/routers/residentinfoRouter.js";
import ResidentBillsRouter from "./src/routers/residentBillsRouter.js";
import ResidentReqRouter from "./src/routers/residentReqRouter.js"
import ResidentNoticeRouter from "./src/routers/residentNoticeRouter.js"


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const PORT = process.env.PORT || 3000;

// Auth routes
app.use("/api/auth", AuthRouter);
//Resident routes
app.use("/api", ResidentRouterInfo);
app.use("/api", ResidentBillsRouter);
app.use("/api", ResidentReqRouter);
app.use("/api", ResidentNoticeRouter);
// Admin routes
app.use("/api", ResidentRouter);
app.use("/api", HousesRouter);
app.use("/api", StaffRouter);
app.use("/api", BillRouter);
app.use("/api", RequestRouter);
app.use("/api", NoticesRouter);
app.use("/api", ParkingRouter);





app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});