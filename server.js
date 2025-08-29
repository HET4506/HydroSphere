import express from "express";
import dotenv from "dotenv";
import sitesRoutes from "./route/sites.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api/sites", sitesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
