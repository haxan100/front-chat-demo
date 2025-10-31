// Fix database tables
const mysql = require('mysql2/promise');

async function fixDB() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'simple_chat'
        });
        
        console.log('Fixing database tables...');
        
        // Drop and recreate groups table with backticks
        await db.execute('DROP TABLE IF EXISTS `groups`');
        
        await db.execute(`
            CREATE TABLE \`groups\` (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                is_private BOOLEAN DEFAULT FALSE,
                created_by VARCHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Insert default groups
        await db.execute(`
            INSERT INTO \`groups\` (id, name, description) VALUES 
            ('general-group', 'General', 'General discussion for everyone'),
            ('random-group', 'Random', 'Random chat and fun topics')
        `);
        
        console.log('✅ Groups table fixed');
        
        // Test query
        const [groups] = await db.execute('SELECT * FROM `groups` ORDER BY name');
        console.log('📋 Groups:', groups);
        
        await db.end();
        console.log('✅ Database fixed successfully!');
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
    }
}

fixDB();