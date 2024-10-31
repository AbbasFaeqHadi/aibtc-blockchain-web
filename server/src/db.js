import mysql from 'mysql2/promise';

// Fetch the database name from environment variables or default to 'blockchain'
const databaseName = process.env.DATABASE_NAME || 'blockchain'; // Dynamic database name

const db = mysql.createPool({
  host: 'localhost', 
  port: 3306,        
  user: 'root', // Update with your MySQL username
  password: 'root', // Update with your MySQL password
  database: databaseName,  // Ensure this matches the created database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then(connection => {
    console.log(`Connected to database: ${databaseName}`);;
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process if the database connection fails
  });

export {db};
