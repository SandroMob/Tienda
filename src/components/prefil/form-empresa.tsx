"use client"
import { useEffect, useState, FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { Empresas, PatchEmpresa } from "@/models/EmpresasModel";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
interface FormEmpresaProps {
    empresaData: Empresas;
    getEmpresaAction: () => void;
}

export default function FormEmpresa({ empresaData, getEmpresaAction }: FormEmpresaProps) {
    const [empresa, setEmpresa] = useState<Empresas>(empresaData);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const { data: session} = useSession();
    useEffect(() => {
        setEmpresa(empresaData);
    }, [empresaData]);

    const tryPatch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.user?.token) return;
        setDisableSubmit(true);
        await PatchEmpresa(session.user.token, empresa);
        setDisableSubmit(false);
        getEmpresaAction();
    };

    return (
        <div>
            <h3 className="font-bold mb-1 mt-3 text-primary">Datos Empresa</h3>
            <form onSubmit={tryPatch}>
                <div className="flex flex-col items-center justify-center p-3">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold text-primary">Razón Social</label>
                            <input
                                type="text"
                                name="razonSocial"
                                onChange={(e) => setEmpresa({ ...empresa, razonSocial: e.target.value })}
                                required
                                value={empresa?.razonSocial || ""}
                                className="w-8/12 bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-800 text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-primary">RUT</label>
                            <input
                                type="text"
                                name="rutEmpresa"
                                onChange={(e) => setEmpresa({ ...empresa, rutEmpresa: e.target.value })}
                                required
                                value={empresa?.rutEmpresa || ""}
                                className="w-8/12 bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-800 text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-primary">Clave SII</label>
                            <input
                                type="password"
                                name="claveSII"
                                onChange={(e) => setEmpresa({ ...empresa, claveSII: e.target.value })}
                                required
                                value={empresa?.claveSII || ""}
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
                                Guardar<Save size={18} />
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}