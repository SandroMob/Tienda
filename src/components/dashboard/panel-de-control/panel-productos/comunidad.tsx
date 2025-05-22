'use client';
import { useState } from 'react';
import { Tienda } from '@/models/TiendaModel';

interface Props {
    tienda: Tienda | null;
}

type Tab = 'form' | 'table';

export default function Comunidad({ tienda }: Props) {

    return (
        <div className="p-4 space-y-4 w-full max-w-5xl">
            {/* Input de búsqueda */}
            <div>
                <label htmlFor="buscar" className="block text-sm font-medium text-primary mb-1">
                Buscar
                </label>
                <input
                type="text"
                id="buscar"
                name="buscar"
                placeholder="Buscar usuarios, comentarios, etc."
                className="w-full bg-zinc-100 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 text-black"
                />
            </div>

            {/* Mensaje de sin resultados */}
            <div className="text-sm text-muted-foreground pt-4">
                No se encontraron resultados.
            </div>
        </div>
    );
}
