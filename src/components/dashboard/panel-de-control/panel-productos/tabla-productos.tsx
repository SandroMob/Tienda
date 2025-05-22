'use client';

import { Producto } from '@/models/ProductoModel';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    productos: Producto[] | null;
    onEditar: (producto: Producto) => void;
}

export default function TablaProductos({ productos, onEditar }: Props) {
    if (!productos?.length) {
        return (
        <div className="text-muted-foreground text-sm p-4 w-screen">
            No hay productos disponibles.
        </div>
        );
    }

return (
    <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-300 text-sm text-left">
            <thead className="bg-muted">
            <tr>
                <th className="px-4 py-2 font-semibold text-primary">Título</th>
                <th className="px-4 py-2 font-semibold text-primary">Descripción</th>
                <th className="px-4 py-2 font-semibold text-primary">Precio</th>
                <th className="px-4 py-2 font-semibold text-primary">Categoría</th>
                <th className="px-4 py-2 font-semibold text-primary text-center">Acciones</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {productos && productos.map((producto, idx) => (
                <tr key={idx} className="transition">
                <td className="px-4 py-2">{producto.title}</td>
                <td className="px-4 py-2 text-muted-foreground">{producto.description}</td>
                <td className="px-4 py-2">${producto.price.toFixed(2)}</td>
                <td className="px-4 py-2">{producto.categoria}</td>
                <td className="px-4 py-2 text-center">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditar(producto)}
                    aria-label="Editar producto"
                    >
                        <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
}
