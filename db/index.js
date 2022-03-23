const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function createUser({
    username,
    password,
    name,
    location 
}) {
    try {
      const { rows } = await client.query(`
      INSERT INTO users(username, password, name, location) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `, [username, password, name, location]);
  
      return rows;
    } catch (error) {
      throw error;
    }
}

async function updateUser(id, fields = {}){
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=${ index + 1 }`
    ).join(', ');

    if (setString.length === 0){
        return;
    }
    try {
        const result = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE if=${ id }
        RETURNING *;
        `, Object.values(fields));

        return result;
        
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT id, username, name, location, active
       FROM users;
    `);
  
    return rows;
}

module.exports = {
    client,
    createUser,
    getAllUsers,
}
