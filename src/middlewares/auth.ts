import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";
import { secret } from "../modules/Auth/auth.service";


const auth = (...roles:any)=>{
    console.log(roles);

    return async(req:Request,res:Response,next:NextFunction)=>{
        // next()
        try {
            const token = req.headers.authorization;
            if(!token){
                return res.status(401).json({
                    success:false,
                    message:'Unauthorized token is missing'
                })
            }

            const decodedToken = jwt.verify(token, secret)
            console.log(decodedToken);
            next()
        } catch (error:any) {
            // return res.status(401).json({
            //     success:false,
            //     message:'Unauthorized token is invalid'
            // })
            next(error)
        }
    }
}
export default auth;    