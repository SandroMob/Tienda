import { handleAxiosError } from "@/utils/axiosErros";
import axios from "axios";
import { toast } from "nextjs-toast-notify";

export interface Empresas {
    _id?: string;
    fechaCreacion?: string;
    razonSocial?: string;
    claveSII?: string;
    rutEmpresa?: string;
}

export const GetEmpresas = async (token: string): Promise<Empresas[]> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/empresas`
        const resp = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return resp.data;
    } catch (error) {
        console.error("Error al traer empresas: ", error);
        throw error;
    }
};

export const PatchEmpresa = async (token: string, empresa: Empresas) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/empresas/${empresa._id}`;

        await axios.post(url, empresa, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        toast.success("Datos actualizados.", { duration: 3000, progress: true, position: "top-center", transition: "fadeIn"});
    } catch (error) {
        handleAxiosError(error, 'empresas');
    }
};