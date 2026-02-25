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
        const isExists = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (!isExists) {
            await prisma.user.create({
                data: adminData
            })
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.log( 'Error seeding admin user:', error);
    }
    finally {
        await prisma.$disconnect();
    }

}

seedAdmin()