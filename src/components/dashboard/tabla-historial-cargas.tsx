"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Transaccion } from "@/models/TransaccionModel";
import FiltroHistorialCargas from "./filtro-historial-cargas";
import { User, GetUsers } from "@/models/UserModel";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function TablaHistorialCargas() {
    const [tableData, setTableData] = useState<Transaccion[]>([]);
    const [userList, setUserList] = useState<User[]>([]);
    const { data } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Selector de filas por página

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                if (data?.user.token) {
                    const result = await GetUsers(data?.user.token);
                    setUserList(result);
                }
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };
        fetchUsuarios();
    }, [data?.user.token]);

    // Verificar si hay datos para mostrar
    const totalRecords = tableData?.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    // Calcular los datos de la página actual
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = tableData?.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div>
            <FiltroHistorialCargas setData={setTableData} users={userList} />

            {/* Controles de paginación */}
            <div className="flex justify-between items-center my-4">
                <div>
                    <label htmlFor="rowsPerPage">Mostrar: </label>
                    <Select
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                        value={rowsPerPage.toString()}
                    >
                    <SelectTrigger className="w-[80px] border rounded">
                        <SelectValue placeholder="5" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
                {totalRecords > 0 && (
                    <p className="text-right font-light">
                        Mostrando {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, totalRecords)} de {totalRecords} resultados
                    </p>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] font-bold">Fondo</TableHead>
                        <TableHead className="text-center font-bold">Serie</TableHead>
                        <TableHead className="text-center font-bold">Run</TableHead>
                        <TableHead className="text-center font-bold">Fecha Archivo</TableHead>
                        <TableHead className="text-center font-bold">Fecha Carga</TableHead>
                        <TableHead className="text-center font-bold">N° Participantes</TableHead>
                        <TableHead className="text-center font-bold">N° Participantes Ins</TableHead>
                        <TableHead className="text-center font-bold">Cuotas Emitidas</TableHead>
                        <TableHead className="text-center font-bold">Cuotas Pagadas</TableHead>
                        <TableHead className="text-right font-bold">Valor Cuota Económico</TableHead>
                        <TableHead className="text-right font-bold">Patrimonio Neto</TableHead>
                        <TableHead className="text-right font-bold">Activo Total</TableHead>
                        <TableHead className="text-right font-bold">Valor Cuota Libro</TableHead>
                        <TableHead className="text-center font-bold">Usuario Carga</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentData?.length > 0 ? (
                        currentData?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell width={"30%"}>{item.fondo}</TableCell>
                                <TableCell>{item.serie}</TableCell>
                                <TableCell>{item.run}</TableCell>
                                <TableCell>{item.fecha.substring(0, 10)}</TableCell>
                                <TableCell>{item.fechaCreacion?.substring(0, 10)}</TableCell>
                                <TableCell className="text-center">{item.nroParticipes}</TableCell>
                                <TableCell className="text-center">{item.nroParticipesIns}</TableCell>
                                <TableCell className="text-center">{item.nroCuotasEmitidas}</TableCell>
                                <TableCell className="text-center">{item.nroCuotasPagadas}</TableCell>
                                <TableCell className="text-right">{item.valorCuotaEconomico}</TableCell>
                                <TableCell className="text-right">{item.patrimonioNeto}</TableCell>
                                <TableCell className="text-right">{item.activoTotal}</TableCell>
                                <TableCell className="text-right">{item.valorCuotaLibro}</TableCell>
                                <TableCell>{item.nombreUsuario}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={14} className="text-center py-4">
                                No hay registros para mostrar.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Paginación */}
            {totalRecords > rowsPerPage && (
                <div className="flex justify-end mt-4">
                    <span className="mt-2 mr-10">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        className="text-primary border-primary w-full sm:w-auto"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        className="text-primary border-primary w-full sm:w-auto"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}
