import { Client } from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: process.env.DB_SSL === 'true' ? {
        ca: fs.readFileSync(process.env.DB_SSL_CA_PATH as string).toString()
    } : undefined,
});

export default client;