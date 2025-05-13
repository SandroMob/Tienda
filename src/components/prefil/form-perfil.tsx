"use client"
import { useEffect, useState } from "react";
import { useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, PatchUser } from "@/models/UserModel";
import { Loader2, Save } from "lucide-react";
import { Button } from "../ui/button";
interface Props {
    userData : User | undefined,
    getUser : () => void;
};

export default function FormPerfil({userData, getUser} : Props) {
    const [user, setUser] = useState<User>(userData ?? { nombre: "", apellido: "", email: "", _id: "" });
    const [disableSubmit, setDisableSubmit] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const tryPatch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.user?.token || !user) return;
        setDisableSubmit(true);
        const updatedUser: User = {
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            email: user.email || "",
            _id: user._id?.toString() || "",
        };
        try {
            await PatchUser(session.user.token, updatedUser);
            getUser();
            router.refresh();
        } catch (error) {
            console.error("Error actualizando usuario:", error);
        } finally {
            setDisableSubmit(false);
        }
    };

    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    return (
        <div>
            <div>
                <h3 className="font-bold mb-1 mt-3 text-primary">Datos Personales</h3>
                <form onSubmit={tryPatch}>
                    <div className="flex flex-col items-center justify-center p-3">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full max-w-2xl">
                            <div>
                                <label className="block text-sm font-bold text-primary">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    onChange={(e) => {
                                        setUser((prevUser) => ({
                                            ...prevUser,
                                            nombre: e.target.value,
                                        }));
                                    }}
                                    required
                                    value={user?.nombre || ""}
                                    className="w-8/12 bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-800 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    onChange={(e) => {
                                        setUser((prevUser) => ({
                                            ...prevUser,
                                            apellido: e.target.value,
                                        }));
                                    }}
                                    required
                                    value={user?.apellido || ""}
                                    className="w-8/12 bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-800 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="mail"
                                    onChange={(e) => {
                                        setUser((prevUser) => ({
                                            ...prevUser,
                                            email: e.target.value,
                                        }));
                                    }}
                                    required
                                    value={user?.email || ""}
                                    className="w-8/12 bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-800 text-black"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-1 mt-3 flex justify-start p-3">
                        <Button
                            type="submit"
                            variant="outline"
                            className="text-primary border-primary w-full sm:w-auto"
                            disabled={disableSubmit}
                        >
                            {disableSubmit ? (
                                <Loader2 className="animate-spin mr-2" width={20} height={20} />
                            ) : (
                                <div className="flex items-center gap-2">
                                    Guardar<Save size={18}></Save>
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}