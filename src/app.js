import express from "express";
import schoolRoutes from "./modules/school/school.route.js";
import healthRoutes from "./modules/health/health.route.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/", healthRoutes);
app.use("/", schoolRoutes);

app.use(errorHandler);

export default app;
