import axios, { AxiosError } from "axios";
import { Producto } from "./ProductoModel";
import { toast } from "nextjs-toast-notify";
import { signOut } from "next-auth/react";
import { handleAxiosError } from "@/utils/axiosErros";

export interface UserRef {
    userID: string;
    role: string;
}

export interface Tienda {
    ID: string;
    Name: string;
    DNI: string;
    Logo: string;
    Facebook: string;
    Instagram: string;
    TikTok: string;
    LinkStore: string;
    users?: UserRef[];
    publications?: Producto[];
    IsGlobal: boolean;
}
//ESCRITURA
export const PostTienda = async (token: string,userID: string,tienda: Tienda) : Promise<Tienda | null> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/tiendas/${userID}`;
        const res = await axios.post(url, tienda, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        toast.success(res.data.message || 'Tienda creada con éxito', {duration: 3000,position: 'top-center',transition: 'fadeIn'});
        return res.data.tienda as Tienda; // ← devolvemos la tienda creada
    } catch (error) {
        handleAxiosError(error, 'tiendas');
        return null; // ← devolvemos null en caso de error
    }
};

export const PutTienda = async ( token: string, tienda: Tienda ) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/tiendas/${tienda.ID}`;
        const res = await axios.put(url, tienda, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        toast.success(res.data.message || 'Tienda actualizada con éxito', { duration: 3000, position: 'top-center',transition: 'fadeIn'});
    } catch (error) {
        handleAxiosError(error, 'tiendas');	
    }
};

//LECTURA
export const GetTiendas = async (token: string, userId: string, palabraClave: string): Promise<Tienda[]> => {
    try {
        const url= `${process.env.NEXT_PUBLIC_APIGO_URL}/api/tiendas/${userId}`;
            const res = await axios.get(url, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error: unknown) {
            handleAxiosError(error, 'tiendas');
        return [];
    }
};