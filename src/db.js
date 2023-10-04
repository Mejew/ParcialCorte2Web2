import { createPool } from "mysql2";
import {
  BD_PORT,
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
} from "./config.js";

export const connection = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: BD_PORT,
  database: DB_DATABASE,
});
