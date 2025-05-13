"use client"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"
import { Loader2, XIcon as Cross } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
    const [error, setError]= useState("");
    const router = useRouter();
    const [disableSubmit, setDisableSubmit] = useState(false);
    const tryLogin = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setDisableSubmit(true);
            const body = new FormData(e.currentTarget);
            const resp =  await signIn("credentials", {
                email: body.get("email")
                ,pass : body.get("pass")?.toString() || ""
                ,redirect : false
            });
            setDisableSubmit(false);
            if (resp?.error) return setError("Credenciales incorrectas");
            if (resp?.ok) return router.push("/dashboard/")
    };

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-300">
            <div className="bg-slate-400 p-6 rounded-lg shadow-lg w-full sm:w-96">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    {/* <img src="/logo-volcom.jpg" alt="Volcom Logo" className="min-h-20" /> */}
                    <h1 className="font-bold text-center text-blue-800 text-lg">MI TIENDA</h1>
                </div>
                <h4 className="font-bold text-center p-3 text-zinc-700" >Iniciar Sesión</h4>
                <form onSubmit={tryLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500 text-white p-2 rounded-md flex items-center justify-between">
                            <span>{error}</span>
                            <Cross
                            onClick={() => setError("")}
                            size="20px"
                            className="cursor-pointer ml-2"
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="email"
                            placeholder="mail@mail.cl"
                            name="email"
                            required
                            className="w-full bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="************"
                            name="pass"
                            required
                            className="w-full bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                    <Button
                        type="submit"
                        disabled={disableSubmit}
                        variant="outline"
                        className="w-full flex items-center justify-center px-4 py-2 rounded-md focus:outline-none text-primary border-primary"
                    >
                        {disableSubmit ? (
                            <Loader2 className="animate-spin mr-2" width={20} height={20} />
                        ) : (
                            "Ingresar"
                        )}
                    </Button>
                    </div>
                </form>
            </div>
        </div>

    )
}