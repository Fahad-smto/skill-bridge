import { prisma } from "../../lib/prisma";



const getMyProfileFromDB = async (userId: number) => {
   const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
         user: {
            select: { id: true, name: true, email: true, role: true }
         },
         availability: { orderBy: { dayOfWeek: "asc" } },
         categories: { include: { category: true } }
      }
   });

   if (!profile) throw new Error('Tutor profile not found');
   return profile;
};

const updateTutorProfileIntoDB = async (userId: number, payload: any) => {
   const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
   });

   if (!existingProfile) throw new Error('Tutor profile not found');

   const result = await prisma.tutorProfile.update({
      where: { userId },
      data: {
         bio: payload.bio,
         hourlyRate: payload.hourlyRate,
         experience: payload.experience,
         location: payload.location,
         imageUrl: payload.imageUrl,
      },
      include: {
         user: {
            select: { name: true, email: true, role: true }
         },
         availability: true,
         categories: { include: { category: true } }
      }
   });

   return result;
};

const setAvailabilityIntoDB = async (userId: number, slots: any[]) => {
   if (!slots || slots.length === 0) throw new Error("At least one slot is required");

   for (const slot of slots) {
      if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) throw new Error("dayOfWeek must be 0 (Sun) to 6 (Sat)");
      if (!slot.startTime || !slot.endTime) throw new Error("Each slot must have startTime and endTime");
      if (slot.startTime >= slot.endTime) throw new Error("startTime must be before endTime");
   }

   const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
   if (!profile) throw new Error("Please create your tutor profile first");

   await prisma.availability.deleteMany({ where: { tutorProfileId: profile.id } });

   await prisma.availability.createMany({
      data: slots.map((slot) => ({
         tutorProfileId: profile.id,
         dayOfWeek: slot.dayOfWeek,
         startTime: slot.startTime,
         endTime: slot.endTime,
      })),
   });

   return await prisma.availability.findMany({
      where: { tutorProfileId: profile.id },
      orderBy: { dayOfWeek: "asc" },
   });
};

// ✅ categories include করা হয়েছে
const getTutorByIdFromDB = async (id: number) => {
   const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
         user: {
            select: { id: true, name: true, email: true }
         },
         availability: { orderBy: { dayOfWeek: "asc" } },
         categories: { include: { category: true } },  // ← NEW
         reviews: {                                      // ← NEW
            include: {
               student: {
                  select: { id: true, name: true }
               }
            },
            orderBy: { createdAt: "desc" }
         }
      }
   });

   if (!tutor) throw new Error('Tutor not found');
   return tutor;
};

// ✅ categories include করা হয়েছে
const getAllTutorsFromDB = async () => {
   const tutors = await prisma.tutorProfile.findMany({
      where: { isApproved: true },
      include: {
         user: {
            select: { id: true, name: true, email: true }
         },
         availability: true,
         categories: { include: { category: true } },  // ← NEW
      },
      orderBy: { avgRating: "desc" }
   });

   return tutors;
};

const getAllCategoriesFromDB = async () => {
   const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
   });

   if (categories.length === 0) throw new Error('No categories found');
   return categories;
};

export const TutorService = {
   createTutorIntoDB,
   getMyProfileFromDB,
   updateTutorProfileIntoDB,
   setAvailabilityIntoDB,
   getAllTutorsFromDB,
   getTutorByIdFromDB,
   getAllCategoriesFromDB,
};