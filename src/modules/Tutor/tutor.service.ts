import { prisma } from "../../lib/prisma";

// ─────────────────────────────────────────
// Create Tutor Profile
// ─────────────────────────────────────────
const createTutorIntoDB = async (payload: any, userId: number) => {
   const user = await prisma.user.findUnique({
      where: { id: userId },
   });

   if (!user) {
      throw new Error('User not found');
   }

   const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: userId }
   });

   if (existingProfile) {
      throw new Error('Tutor profile already exists for this user');
   }

   const result = await prisma.tutorProfile.create({
      data: {
         userId: userId,
         bio: payload.bio,
         hourlyRate: payload.hourlyRate,
         experience: payload.experience || 0,
         location: payload.location,
         imageUrl: payload.imageUrl,
         isApproved: payload.isApproved ?? true,
         avgRating: 0,
         totalReviews: 0,
      },
      include: {
         user: {
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

// ─────────────────────────────────────────
// Get My Profile
// ─────────────────────────────────────────
const getMyProfileFromDB = async (userId: number) => {

   const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
         user: {
            select: {
               id: true,
               name: true,
               email: true,
               role: true,
            }
         },
         availability: {
            orderBy: { dayOfWeek: "asc" }
         }
      }
   });

   if (!profile) {
      throw new Error('Tutor profile not found');
   }

   return profile;
};

// ─────────────────────────────────────────
// Update Tutor Profile
// ─────────────────────────────────────────
const updateTutorProfileIntoDB = async (userId: number, payload: any) => {

   // Check profile exists
   const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
   });

   if (!existingProfile) {
      throw new Error('Tutor profile not found. Please create your profile first');
   }

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
            select: {
               name: true,
               email: true,
               role: true
            }
         },
         availability: true,
      }
   });

   return result;
};

// ─────────────────────────────────────────
// Set Availability
// ─────────────────────────────────────────
const setAvailabilityIntoDB = async (userId: number, slots: any[]) => {

   if (!slots || slots.length === 0) {
      throw new Error("At least one slot is required");
   }

   for (const slot of slots) {
      if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
         throw new Error("dayOfWeek must be 0 (Sun) to 6 (Sat)");
      }
      if (!slot.startTime || !slot.endTime) {
         throw new Error("Each slot must have startTime and endTime");
      }
      if (slot.startTime >= slot.endTime) {
         throw new Error("startTime must be before endTime");
      }
   }

   const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
   });

   if (!profile) {
      throw new Error("Please create your tutor profile first");
   }

   await prisma.availability.deleteMany({
      where: { tutorProfileId: profile.id },
   });

   await prisma.availability.createMany({
      data: slots.map((slot) => ({
         tutorProfileId: profile.id,
         dayOfWeek: slot.dayOfWeek,
         startTime: slot.startTime,
         endTime: slot.endTime,
      })),
   });

   const availability = await prisma.availability.findMany({
      where: { tutorProfileId: profile.id },
      orderBy: { dayOfWeek: "asc" },
   });

   return availability;
};

export const TutorService = {
   createTutorIntoDB,
   getMyProfileFromDB,       // ← NEW
   updateTutorProfileIntoDB, // ← NEW
   setAvailabilityIntoDB,
};