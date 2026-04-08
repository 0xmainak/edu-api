import "dotenv/config";
import app from "./app.js";
import initDb from "./config/initDb.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await initDb();
    console.log("Database initialized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
