import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { TutorRoutes } from "../modules/Tutor/tutor.route"; 
import { BookingRoutes } from "../modules/Booking/booking.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
 


const router =Router();
 
const routerManager =[
    {
        path: '/auth',
        route: AuthRoutes
    },
    {  
        path: '/tutor',
        route: TutorRoutes
    },
    {
        path:'/booking',
        route:BookingRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    }
]

routerManager.forEach((route)=>{
    router.use(route.path,route.route);
})

export default router;