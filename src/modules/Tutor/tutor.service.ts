 import { prisma } from "../../lib/prisma";

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
// NEW — Set Availability
// ─────────────────────────────────────────
const setAvailabilityIntoDB = async (userId: number, slots: any[]) => {

   // Check slots are provided
   if (!slots || slots.length === 0) {
      throw new Error("At least one slot is required");
   }

   // Validate each slot
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

   // Check tutor profile exists
   const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
   });

   if (!profile) {
      throw new Error("Please create your tutor profile first");
   }

   // Delete old slots
   await prisma.availability.deleteMany({
      where: { tutorProfileId: profile.id },
   });

   // Insert new slots
   await prisma.availability.createMany({
      data: slots.map((slot) => ({
         tutorProfileId: profile.id,
         dayOfWeek: slot.dayOfWeek,
         startTime: slot.startTime,
         endTime: slot.endTime,
      })),
   });

   // Return saved availability
   const availability = await prisma.availability.findMany({
      where: { tutorProfileId: profile.id },
      orderBy: { dayOfWeek: "asc" },
   });

   return availability;
};

export const TutorService = {
   createTutorIntoDB,
   setAvailabilityIntoDB, // ← NEW
};