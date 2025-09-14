#!/usr/bin/env tsx
import dotenv from 'dotenv';
import { tidb } from '../mastra/config/tidb';

dotenv.config();

async function resetTiDB() {
  console.log('🔄 Resetting TiDB tables...\n');
  
  try {
    await tidb.connect();
    
    // Drop existing table
    console.log('🗑️ Dropping existing table...');
    await tidb.connection!.execute('DROP TABLE IF EXISTS clinical_cases');
    console.log('✅ Table dropped successfully\n');
    
    // Recreate table with correct schema
    console.log('🏗️ Creating new table...');
    await tidb.initializeTables();
    console.log('✅ Table created successfully\n');
    
    await tidb.disconnect();
    console.log('🎉 TiDB reset completed!');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

async function main() {
  try {
    await resetTiDB();
    process.exit(0);
  } catch (error) {
    console.error('Reset script failed:', error);
    process.exit(1);
  }
}

main();
