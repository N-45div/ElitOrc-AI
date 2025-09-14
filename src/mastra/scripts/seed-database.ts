#!/usr/bin/env tsx

import { seedDatabase } from '../data/sampleCases';

async function main() {
  try {
    console.log('🚀 Starting TiDB database seeding...');
    await seedDatabase();
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

main();
