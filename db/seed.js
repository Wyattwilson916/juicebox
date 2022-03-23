const { rows } = require("pg/lib/defaults");
const { client, getAllUsers, createUser } = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; // we pass the error up to the function that calls dropTables
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function createInitialUsers() {
    try {
      console.log("Starting to create users...")
      
      await createUser({ username: 'albert', password: 'bertie99', name: 'albert', location: 'Florida'});
      await createUser({ username: 'sandra', password: 'sandra123', name: 'sandra', location: 'Texas'});
      await createUser({ username: 'glamgal', password: 'glamgal123', name: 'glamgal', location: 'Illinois'});

      console.log('Finished creating users!');

    } catch (error) {

      console.log('Error creating users!');
      throw error;
    } 
}


async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());