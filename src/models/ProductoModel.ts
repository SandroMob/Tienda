import axios, { AxiosError } from "axios";
import { toast } from "nextjs-toast-notify";
import { signOut } from "next-auth/react";
import { handleAxiosError } from "@/utils/axiosErros";
export interface Producto {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    price: number;
    images: string[];
    categoria: string;
}
//ESCRITURA
export const PostProducto = async (token: string,producto: Producto,tiendaID: string, userId: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/productos/${tiendaID}/${userId}`;
        const res = await axios.post(url, producto, {headers: {Authorization: `Bearer ${token}`,'Content-Type': 'application/json'}});
        toast.success(res.data.message || 'Producto creado con éxito', {duration: 3000,position: 'top-center',transition: 'fadeIn'});
    } catch (error) {
        //Obtengo el status del error
        handleAxiosError(error, 'productos',);
    }
};

export const PutProducto = async (token: string,producto: Producto,tiendaID: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/productos/${tiendaID}/${producto.id}`;
        const res = await axios.put(url, producto, {headers: {Authorization: `Bearer ${token}`,'Content-Type': 'application/json'}});
        toast.success(res.data.message || 'Producto actualizado con éxito', {duration: 3000,position: 'top-center',transition: 'fadeIn'});
    } catch (error) {
        handleAxiosError(error, 'productos');
    }
};

//LECTURA
export const GetProductosTienda = async (token: string, tiendaID: string, palabraClave: string): Promise<Producto[]> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/productos/${tiendaID}?q=${palabraClave}`;
        const res = await axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error: unknown) {
            const axiosError = error as AxiosError;
            const statusCode = axiosError.response?.status;
            if (statusCode === 401) {
                console.error("Token expirado. Cerrando sesión...");
                toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.", { duration: 3000,    progress: true,     position: "top-center",    transition: "fadeIn"});
                signOut();
                return [];
            }
        console.error("Al traer porductos de tienda: ", error);
        toast.error("Error al traer productos de la tienda.", {duration: 3000,progress: true,position: "top-center",transition: "fadeIn"});
        return [];
    }
};

