import pg from "pg";

const db = new pg.Client({
    user: "postgres", 
    host: "localhost",
    database: "blog-webapp-users",
    password: "Rawad2004",
    port: 5433,
});

db.connect(); 

export default db;
