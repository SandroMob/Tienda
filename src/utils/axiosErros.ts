// src/utils/apiErrorHandler.ts
import { AxiosError } from "axios";
import { toast } from "nextjs-toast-notify";
import { signOut } from "next-auth/react";

export const handleAxiosError = (error: unknown, context: string): void => {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    //Acá lo que pretendo es ir guardando mensajes de error que vamos a retornar al cliente por los request, debido a que para que
    //se puedan manejar los errores hay que agregar una fila de ifs o switch para cada error que se pueda dar...
    switch (statusCode) {
        case 400:
            console.log("Error de validación.");
            toast.error("Error de validación. Por favor, verifica los datos ingresados.", {
                duration: 3000,
                position: "top-center",
                transition: "fadeIn",
            });
        break;

        case 401:
            console.log("Token expirado.");
            toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.", {
                duration: 3000,
                progress: true,
                position: "top-center",
                transition: "fadeIn",
            });
            setTimeout(() => {
                signOut();
            }, 1000);
            break;

        case 403:
            //Desde el backend estoy mandando 403 para cuando se llega al límite del plan, por ahora tiendas y productos
            console.log("Restricción de plan.");
            toast.error(`Ya llegaste al límite de ${context} de tu plan!.`, {
                duration: 3000,
                position: "top-center",
                transition: "fadeIn",
            });
            break;

        case 404:
            //404 generico para cuando no vengan datos o cuando no se encuentre el endpoint
            console.log("No se encontraron datos.");
            break;
        default:
            console.log("Error inesperado:", error);
            toast.error("Error inesperado. Por favor, intente nuevamente.", {
                duration: 3000,
                position: "top-center",
                transition: "fadeIn",
            });
        break;
    }
};
