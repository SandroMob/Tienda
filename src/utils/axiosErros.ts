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
            console.error("Error de validación.");
            toast.error("Error de validación. Por favor, verifica los datos ingresados.", {
                duration: 3000,
                position: "top-center",
                transition: "fadeIn",
            });
        break;

        case 401:
            console.error("Token expirado.");
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
            console.error("Restricción de plan.");
            toast.error(`Ya llegaste al límite de ${context} de tu plan!.`, {
                duration: 3000,
                position: "top-center",
                transition: "fadeIn",
            });
            break;

        default:
            console.error("Error inesperado:", error);
            toast.error("Error inesperado. Por favor, intente nuevamente.", {
                duration: 3000,
                position: "top-center",
                transition: "fadeIn",
            });
        break;
    }
};
