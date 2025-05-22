import axios, { AxiosError } from "axios";
import { toast } from "nextjs-toast-notify";
import { signOut } from "next-auth/react";
export interface Producto {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    price: number;
    images: string[];
    phone: string;
    storeName: string;
    storeDNI: string;
    storeLogo: string;
    facebookLink: string;
    instagramLink: string;
    categoria: string;
}
//ESCRITURA
export const PostProducto = async (token: string,producto: Producto,tiendaID: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/productos/${tiendaID}`;
        const res = await axios.post(url, producto, {headers: {Authorization: `Bearer ${token}`,'Content-Type': 'application/json'}});
        toast.success(res.data.message || 'Producto creado con éxito', {duration: 3000,position: 'top-center',transition: 'fadeIn'});
    } catch (error) {
        console.error('Error al crear producto:', error);
        toast.error('Error al crear el producto. Por favor, verifique los datos.',{duration: 3000,position: 'top-center',transition: 'fadeIn'});
        throw error;
    }
};

export const PutProducto = async (token: string,producto: Producto,tiendaID: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/productos/${tiendaID}/${producto.id}`;
        const res = await axios.put(url, producto, {headers: {Authorization: `Bearer ${token}`,'Content-Type': 'application/json'}});
        toast.success(res.data.message || 'Producto actualizado con éxito', {duration: 3000,position: 'top-center',transition: 'fadeIn'});
    } catch (error) {
        console.error('Error al editar producto:', error);
        toast.error('Error al editar el producto. Por favor, verifique los datos.',{duration: 3000,position: 'top-center',transition: 'fadeIn'});
        throw error;
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

