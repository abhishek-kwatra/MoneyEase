import pg from "pg";

const db = new pg.Client({
    user:"postgres",
    host:"localhot",
    database:"Splitease",
    password:"postgres@superuser",
    port:"5432"
});
db.connect();
export default db;