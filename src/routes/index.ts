import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { TutorRoutes } from "../modules/Tutor/tutor.route";
 


const router =Router();
 
const routerManager =[
    {
        path: '/auth',
        route: AuthRoutes
    },
    {  
        path: '/tutor',
        route: TutorRoutes
    }
]

routerManager.forEach((route)=>{
    router.use(route.path,route.route);
})

export default router;