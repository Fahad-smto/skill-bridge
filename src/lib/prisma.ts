import "dotenv/config";
import pg from 'pg';
const { Pool } = pg; // Destructure correctly
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// SSL এনাবল করে Pool তৈরি করুন
const pool = new Pool({ 
  connectionString,
  ssl: true // Neon DB এর জন্য এটি প্রয়োজন হতে পারে
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };