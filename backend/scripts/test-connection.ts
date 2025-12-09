import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version() as version`;
    console.log('📊 Database version:', result);
    
    // Test if users table is accessible
    const users = await prisma.user.findMany({ take: 1 });
    console.log(`📦 Found ${users.length} users in the database`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

async function testApiConnection() {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:8080';
    console.log(`🌐 Testing API connection to ${apiUrl}...`);
    
    const response = await axios.get(`${apiUrl}/health`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ API Connection successful:', response.data);
  } catch (error: any) {
    console.error('❌ API Connection failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

async function runTests() {
  console.log('🚀 Starting connection tests...\n');
  
  await testDatabaseConnection();
  console.log('\n---\n');
  await testApiConnection();
  
  console.log('\n✨ All tests completed successfully!');
}

runTests().catch(console.error);