"use client";

import { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Transaccion, GetCargas } from "@/models/TransaccionModel";
import { getSession } from "next-auth/react";

export default function GraficoCargasPorFondo() {
    const [dataGrafico, setDataGrafico] = useState();
    const [nombreFondo, setNombreFondo] = useState("");
    useEffect(() => {
        const GetDataGrafico = async () => {
            const dataSession = await getSession();
            if (!dataSession) return;
            const response :  Transaccion[] = await GetCargas(dataSession.user.token, "","","","", "",nombreFondo);
            if (!response) return [];
            const processedData = response.reduce((acc: any, item: Transaccion) => {
                const fondoExistente: Transaccion = acc.find((f: Transaccion) => f.fondo === item.fondo);
                const valorCuotaLibroFloat = parseFloat(item.valorCuotaLibro);
                if (fondoExistente) {
                    fondoExistente.valorCuotaLibro += valorCuotaLibroFloat;
                } else {
                    acc.push({ fondo: item.fondo, valorCuotaLibro: valorCuotaLibroFloat });
                }
                return acc;
            }, []);
            setDataGrafico(processedData);
        };
        GetDataGrafico();
    }, [nombreFondo]);

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
        mobile: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <div className="shadow-md" >
            <CardHeader>
                <CardTitle>Cargas por fondo:</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={dataGrafico} width={600} height={400}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="fondo"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 15) + "..."}
                        />
                        <Tooltip labelClassName="text-black"/>
                        <Bar dataKey="valorCuotaLibro" fill="hsl(var(--chart-1))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex justify-center items-center">
                <div className="w-full flex justify-center">
                    <input
                        type="text"
                        placeholder="Nombre Fondo"
                        name="nombre_fondo"
                        value={nombreFondo}
                        onChange={(e) => setNombreFondo(e.target.value)}
                        className="w-100 bg-zinc-100 px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-800 text-black focus:text-black"
                    />
                </div>
            </CardFooter>
        </div>
    );
}
