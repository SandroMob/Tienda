"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GetCargas, Transaccion } from "@/models/TransaccionModel";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User } from "@/models/UserModel";
interface FiltroProps {
    setData: (data: Transaccion[]) => void;
    users: User[]
}

export default function FiltroHistorialCargas({ setData, users }: FiltroProps) {

    const [fechaDesde, setFechaDesde] = useState<string>("");
    const [fechaHasta, setFechaHasta] = useState<string>("");
    const [idUsuario, setIdUsuario] = useState<string>("0");
    useEffect(() => {
        const getData5Dias = async () => {
            try {
                const data = await getSession();
                if (data?.user?.token) {
                    const hoy = new Date();
                    const fechaDesde = new Date(hoy);
                    fechaDesde.setDate(hoy.getDate() - 5);
                    const fechaDesdeISO = fechaDesde.toISOString();
                    const fechaHasta = new Date(hoy);
                    fechaHasta.setDate(hoy.getDate() + 1);
                    const fechaHastaISO = fechaHasta.toISOString();
                    const cargas = await GetCargas(data.user.token, idUsuario,"","",fechaDesdeISO, fechaHastaISO);
                    setData(cargas);
                }
            } catch (error) {
                console.error("Error al obtener las empresas:", error);
            }
        };
        getData5Dias();
    }, []);

    const filtrar = async () => {
        const data = await getSession();
        if (data?.user?.token) {
            try {
                const fechaDesdeISO = fechaDesde ? new Date(fechaDesde).toISOString() : "";
                const fechaHastaISO = fechaHasta ? new Date(fechaHasta).toISOString() : "";
                const cargas = await GetCargas(data.user.token, idUsuario, "", "",fechaDesdeISO,fechaHastaISO);
                setData(cargas);
            } catch (error) {
                console.error("Error al obtener las empresas:", error);
            }
        }
    };



    const selectUsuarioChange = (idSeleccionado: string) =>{
        console.log(idSeleccionado);
        setIdUsuario(idSeleccionado);
    }

    return(
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
            <label className="text-sm font-medium">
                    Fecha: Desde/Hasta
                </label>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Input
                    type="date"
                    name="fechaDesde"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                />
                <label className="py-1">-</label>
                <Input
                    type="date"
                    name="fechaHasta"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                />
                <Select onValueChange={(val) => {
                    selectUsuarioChange(val);
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={"0"}>Todos</SelectItem>
                            {users.map((user) => (
                                <SelectItem key={user._id} value={user._id?.toString() || ""}>
                                    {user.nombre+" "+user.apellido}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    className="text-primary border-primary w-full sm:w-auto"
                    onClick={filtrar}
                >
                    Buscar
                </Button>
            </div>
        </div>
    )
}