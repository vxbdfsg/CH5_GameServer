import dbPool from "../../db/database.js";

export const testConnection = async (pool) => {
    try{
        const [rows] = await dbPool.query(`SELECT 1+ 1 AS solution`);
        console.log(`${rows[0].solution}`);
    }catch(e){
        console.error(e);
    }
}