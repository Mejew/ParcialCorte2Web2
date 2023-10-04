import { config } from "dotenv";
config();
export const PORT = process.env.PORT || 1005;
export const DB_DATABASE = process.env.DB_DATABASE || "gestion";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "root";
export const BD_PORT = process.env.BD_PORT || 3306;
export const DB_HOST = process.env.DB_HOST || "localhost";
