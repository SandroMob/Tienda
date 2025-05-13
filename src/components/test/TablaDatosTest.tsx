"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "../ui/button";
import { Empresas } from "@/models/EmpresasModel";
import { GetEmpresas } from "@/models/EmpresasModel";
import { useSession } from "next-auth/react";

export default function TablaDatosTest() {
    const [dataTest, setDataTest] = useState<Empresas[]>([]);
    const { data } = useSession();

    const fetchData = async () => {
        if (data?.user?.token) {
            try {
                const empresas = await GetEmpresas(data.user.token);
                setDataTest(empresas);
            } catch (error) {
                console.error("Error al obtener las empresas:", error);
            }
        } else {
            console.log("Token no disponible.");
        }
    };
    return (
        <div className="">
            <Button onClick={() => fetchData()}>Add Datos</Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Razon Social</TableHead>
                        <TableHead>Fecha Creacion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataTest.length > 0 &&
                        dataTest.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item._id}</TableCell>
                                <TableCell>{item.razonSocial}</TableCell>
                                <TableCell>{item.fechaCreacion}</TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
