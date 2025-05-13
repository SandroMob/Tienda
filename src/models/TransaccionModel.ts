import axios from "axios";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { toast } from "nextjs-toast-notify";
export interface Transaccion {
  _id?: number;
  fondo: string;
  serie: string;
  run: string;
  fecha: string;
  fechaCreacion?: string;
  nroParticipes: number;
  nroParticipesIns: number;
  nroCuotasEmitidas: number;
  nroCuotasPagadas: number;
  valorCuotaEconomico: string;
  patrimonioNeto: string;
  activoTotal: string;
  valorCuotaLibro: string;
  id_usuario?: string;
  nombreUsuario?: string;
}

  export const GetCargas = async (token: string, id_empresa : string, fechaDesde? : string,fechaHasta? : string, fechaCreacionDesde? : string, fechaCreacionHasta? : string, nombreFondo? : string): Promise<Transaccion[]> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/cargas`
        const resp = await axios.get(url,  {
          params: {
            fechaDesde: fechaDesde || "",
            fechaHasta: fechaHasta || "",
            fechaCreacionDesde: fechaCreacionDesde || "",
            fechaCreacionHasta: fechaCreacionHasta || "",
            nombreFondo: nombreFondo || "",
            id_usuario: id_empresa
          },
          headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
          },
        });
        return resp.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status;
        if (statusCode === 401) {
          console.error("Token expirado. Cerrando sesión...");
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.", { duration: 3000,    progress: true,     position: "top-center",    transition: "fadeIn"});
          signOut();
        } else {
          console.error("Error al traer cargas: ", axiosError.response?.data || axiosError.message);
        }
      }
      return [];
  };

  export const CargarDatos = async (token: string,dataCarga?: Transaccion[]): Promise<void> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/cargas`;
        const jsonData = JSON.stringify(dataCarga);
        await axios.post(url, jsonData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success("Datos Guardados Correctamente", {  duration: 3000,progress: true,position: "top-center",transition: "fadeIn", icon: '',sonido: false});
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status;
      if (statusCode === 401) {
        console.error("Token expirado. Cerrando sesión...");
        toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.", { duration: 3000,    progress: true,     position: "top-center",    transition: "fadeIn"});
        signOut();
      } else {
        console.error("Error al cargar datos: ", axiosError.response?.data || axiosError.message);
        toast.error("Error en la carga de datos. Por favor, Corrobore el archivo e intente nuevamente.", {    duration: 3000,  progress: true,  position: "top-center",   transition: "fadeIn"});
      }
    }
  };
