"use client"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"
import { Loader2, Eye, EyeOff, User, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [disableSubmit, setDisableSubmit] = useState(false);

    const tryLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisableSubmit(true);
        setError("");
        
        const body = new FormData(e.currentTarget);
        const resp = await signIn("credentials", {
            email: body.get("email")?.toString() || "",
            pass: body.get("pass")?.toString() || "",
            redirect: false
        });
        
        setDisableSubmit(false);
        if (resp?.error) return setError("Usuario no registrado");
        if (resp?.ok) return router.push("/dashboard/");
    };

    const tryRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisableSubmit(true);
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("pass")?.toString() || "";
        const confirmPassword = formData.get("confirmPass")?.toString() || "";

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setDisableSubmit(false);
            return;
        }

        try {
            // Llamada a la API route de NextAuth para registro
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.get("nombre")?.toString() || "",
                    apellido: formData.get("apellido")?.toString() || "",
                    email: formData.get("email")?.toString() || "",
                    pass: password,
                }),
            });

            if (response.ok) {
                setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
                setIsLogin(true);
                // Limpiar el formulario
                (e.target as HTMLFormElement).reset();
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.message || errorData.error || "Error al registrar usuario");
            }
        } catch (error) {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setDisableSubmit(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setSuccess("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header con animación */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                        <span className="text-white font-bold text-xl">MT</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mercado Comunidad</h1>
                    <p className="text-gray-600">
                        {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
                    </p>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex relative">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 ${
                                isLogin 
                                    ? "text-blue-600 bg-blue-50" 
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <LogIn className="w-4 h-4 inline mr-2" />
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 ${
                                !isLogin 
                                    ? "text-blue-600 bg-blue-50" 
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            Registrarse
                        </button>
                        
                        {/* Indicador activo */}
                        <div 
                            className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                                isLogin ? "left-0 w-1/2" : "left-1/2 w-1/2"
                            }`}
                        />
                    </div>

                    {/* Contenido del formulario */}
                    <div className="p-8">
                        {/* Mensajes */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg animate-in slide-in-from-left-2 duration-300">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                        
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg animate-in slide-in-from-left-2 duration-300">
                                <p className="text-green-700 text-sm">{success}</p>
                            </div>
                        )}

                        {/* Formulario de Login */}
                        {isLogin ? (
                            <form onSubmit={tryLogin} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo electrónico"
                                            required
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="pass"
                                            placeholder="Contraseña"
                                            required
                                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    {disableSubmit ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                                            Ingresando...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="mr-2 w-5 h-5" />
                                            Iniciar Sesión
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            /* Formulario de Registro */
                            <form onSubmit={tryRegister} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="nombre"
                                                placeholder="Nombre"
                                                required
                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="apellido"
                                                placeholder="Apellido"
                                                required
                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo electrónico"
                                            required
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="pass"
                                            placeholder="Contraseña"
                                            required
                                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPass"
                                            placeholder="Confirmar contraseña"
                                            required
                                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    {disableSubmit ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                                            Registrando...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 w-5 h-5" />
                                            Crear Cuenta
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    {isLogin ? (
                        <p>
                            ¿No tienes cuenta?{" "}
                            <button
                                onClick={switchMode}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    ) : (
                        <p>
                            ¿Ya tienes cuenta?{" "}
                            <button
                                onClick={switchMode}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}