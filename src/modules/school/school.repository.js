import pool from "../../config/db.js";

const insertSchool = async ({ name, address, latitude, longitude }) => {
  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  const [result] = await pool.execute(query, [
    name,
    address,
    latitude,
    longitude,
  ]);
  return result;
};

const findAllSchools = async () => {
  const query = "SELECT * FROM schools";
  const [rows] = await pool.execute(query);
  return rows;
};

export { insertSchool, findAllSchools };
