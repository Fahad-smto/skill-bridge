import bcrypt from 'bcrypt';
import { userRole } from '../middlewares/auth';
import { prisma } from '../lib/prisma';

const seedAdmin = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminData = {
        name: 'Admin',
        email: 'admin@example.com',
        role: userRole.ADMIN,
        password: hashedPassword
    }

    try {
        // ─────────────────────────────────────────
        // Admin তৈরি করো
        // ─────────────────────────────────────────
        const isExists = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (!isExists) {
            await prisma.user.create({
                data: adminData
            });
            console.log('✅ Admin user created successfully');
        } else {
            console.log('ℹ️ Admin already exists');
        }

        // ─────────────────────────────────────────
        // Categories তৈরি করো
        // ─────────────────────────────────────────
        const categories = [
            { name: "Mathematics", icon: "📐" },
            { name: "Programming", icon: "💻" },
            { name: "English", icon: "📖" },
            { name: "Science", icon: "🔬" },
            { name: "History", icon: "🏛️" },
            { name: "Music", icon: "🎵" },
            { name: "Design", icon: "🎨" },
            { name: "Business", icon: "💼" },
        ];

        for (const category of categories) {
            await prisma.category.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }

        console.log('✅ Categories created successfully');
        console.log('🎉 Seeding complete!');

    } catch (error) {
        console.log('❌ Error seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();