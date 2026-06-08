/**
 * Server Entry Point
 * 
 * Starts the Express server listening on the configured port.
 * Separated from app configuration for easier testing.
 */

import "dotenv/config";
import { createApp } from "./app";

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Architecture: Modular Monolith`);
});