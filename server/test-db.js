// Test database connection
const mysql = require('mysql2/promise');

async function testDB() {
    try {
        console.log('Testing database connection...');
        
        // Test connection without database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });
        
        console.log('✅ MySQL connection successful');
        
        // Create database
        await connection.execute('CREATE DATABASE IF NOT EXISTS simple_chat');
        console.log('✅ Database created/verified');
        
        await connection.end();
        
        // Test connection with database
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'simple_chat'
        });
        
        console.log('✅ Database connection successful');
        
        // Test query
        const [rows] = await db.execute('SHOW TABLES');
        console.log('📋 Tables:', rows.map(r => Object.values(r)[0]));
        
        await db.end();
        console.log('✅ All tests passed!');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        process.exit(1);
    }
}

testDB();