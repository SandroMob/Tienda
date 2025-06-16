import axios from "axios"
import { toast } from "nextjs-toast-notify";
import { Empresas } from "./EmpresasModel";
import * as crypto from "crypto";
import { handleAxiosError } from "@/utils/axiosErros";

export interface User{
    _id? : string
    nombre? :string
    apellido? : string
    email? : string
    fecha_creacion? : string
    id_empresa? : number,
    api_token? : string
    empresa? : Empresas
}

export const GetUsers = async (token: string): Promise<User[]> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/users`
        const resp = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return resp.data;
    } catch (error) {
        console.error("Error al cargar listado de usuarios: ", error);
        throw error;
    }
}

export const PatchUser = async (token: string, user: User) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/users`;
        await axios.post(url, user, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        toast.success("Datos actualizados.", {
            duration: 3000,
            progress: true,
            position: "top-center",
            transition: "fadeIn",
        });
    } catch (error) {
        handleAxiosError(error, 'users');
        throw error;
    }
};

export const GetUser = async (token: string, idUsario: string = ""): Promise<User> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/users/${idUsario}`;
        const resp = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const userData = resp.data.usuario;
        return {
            ...userData,
            _id: userData._id || userData.id,
        };
    } catch (error) {
        console.error("Error al cargar listado de usuarios: ", error);
        throw error;
    }
};

export function encrypt(text: string = ""): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(process.env.SECRETKEY32 as string, "hex"),Buffer.from(process.env.SECRETKEY16 as string, "hex"));
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return Buffer.from(process.env.SECRETKEY16 as string, "hex").toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText: string): string {
    const [ivHex, encryptedData] = encryptedText.split(":");
    const ivBuffer = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(process.env.SECRETKEY32 as string, "hex"), ivBuffer);
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
