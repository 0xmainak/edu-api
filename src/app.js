import express from "express";
import schoolRoutes from "./modules/school/school.route.js";
import healthRoutes from "./modules/health/health.route.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
    name: "edu-api",
    version: "1.0.0",
    description: "School Management API",
  });
});

app.use("/", healthRoutes);
app.use("/", schoolRoutes);

app.use(errorHandler);

export default app;
