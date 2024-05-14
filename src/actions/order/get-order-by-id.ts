"use server"

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";


export const getOrderById = async (id:string)=>{

    // pensar que cualquiera pudo haber puesto cualquier codigo- Debe verificarse
    // tambien hay que verificar que esa orden sea de ese usuario.
    const session = await auth();  // para ver quien es el usuario

    if(! session?.user){
        return {
            ok:false,
            message:"Debe estar autenticado",
        }
    }

    try {

        const order = await prisma.order.findUnique({
            where:{id},
            include:{
                OrderAddress:true,
                OrderItem:{
                    select:{
                        price:true,
                        quantity:true,
                        size:true,

                        product:{
                            select:{
                                title:true,
                                slug:true,
                                ProductImage:{
                                    select:{
                                        url:true
                                    },
                                    take:1
                                }
                            }
                        }
                    }
                }
            }
        });

        // la orden no existe y regresa nulo

        if(!order){
            throw `${id} no existe`;
        }

        // si la orden corresponde al usuario logueado si es usuario. El admin ve todos

        if (session.user.role === 'user'){

            if (session.user.id !== order.userId){
                throw `${id} no es de ese usuario`;
            }
        }

        return {
            ok:true,
            order:order,
        }
    } catch (error) {
        console.log(error)
        return {
            ok:false,
            message:"Orden no existe",
        }
        
    }


}