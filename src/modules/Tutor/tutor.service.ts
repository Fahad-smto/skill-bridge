import { prisma } from "../../lib/prisma";

const createTutorIntoDB = async (payload: any, userId: number) => {
    
   // ১. প্রথমে ইউজার আছে কিনা চেক করুন
   const user = await prisma.user.findUnique({
      where: {
         id: userId
      },
   });

   if (!user) {
      throw new Error('User not found');
   }

   // ২. চেক করুন এই ইউজারের ইতিমধ্যে TutorProfile আছে কিনা
   const existingProfile = await prisma.tutorProfile.findUnique({
      where: {
         userId: userId  // @unique ফিল্ড ব্যবহার করে
      }
   });

   if (existingProfile) {
      throw new Error('Tutor profile already exists for this user');
   }

   // ৩. সঠিক মডেলে create করুন - TutorProfile
   const result = await prisma.tutorProfile.create({
      data: {
         userId: userId,
         bio: payload.bio,
         hourlyRate: payload.hourlyRate,
         experience: payload.experience || 0,
         location: payload.location,
         imageUrl: payload.imageUrl,
         isApproved: payload.isApproved ?? true,  // ?? মানে যদি undefined/null হয় তাহলে true সেট করবে
         avgRating: 0,
         totalReviews: 0,
         // অন্যান্য ফিল্ড
      },
      include: {
         user: {  // ইউজারের তথ্যও দেখতে চাইলে
            select: {
               name: true,
               email: true,
               role: true
            }
         }
      }
   });
   
   return result;
};

export const TutorService = {
   createTutorIntoDB
};