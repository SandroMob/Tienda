"use client";
import FormEmpresa from "@/components/prefil/form-empresa";
import FormPerfil from "@/components/prefil/form-perfil";
import { Card, CardContent } from "@/components/ui/card";
import { User,GetUser } from "@/models/UserModel";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export default function Perfil() {
    const [userData, setUserData] = useState<User>();
    const { data: session} = useSession();
    const getUser = useCallback(async () => {
        try {
            if (!session?.user?.token) return;
            const user = await GetUser(session.user.token, session.user._id);
            setUserData(user);
        } catch (error) {
            console.error("Error obteniendo el usuario:", error);
        }
    }, [session]);
    
    useEffect(() => {
        getUser();
    }, [getUser]);


    return (
        <div>
            <h1 className="text-2xl font-bold text-primary">Perfil</h1>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl flex flex-col gap-6">
                    <div className="flex justify-center gap-x-10">
                        <Card className="w-4/5">
                            <CardContent>
                                <FormPerfil userData={userData} getUser={getUser} />
                            </CardContent>
                        </Card>
                        {userData && userData.empresa && (
                            <Card className="w-4/5">
                                <CardContent>
                                    <FormEmpresa empresaData={userData.empresa} getEmpresaAction={getUser}/>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
