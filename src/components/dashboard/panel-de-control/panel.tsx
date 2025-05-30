'use client';

import { useState, useEffect } from 'react';
import { Tienda } from '@/models/TiendaModel';
import FormTienda from './panel-tienda/form-editar-tienda';
import { XMarkIcon } from '@/components/ui/localIcons';
import PanelControlProducto from './panel-productos/panel';
import Comunidad from './panel-productos/comunidad';
interface Props {
    tienda: Tienda | null;
    open: boolean;
    onClose: () => void;
    onTiendaUpdated: (tienda: Tienda) => void;
}

const tabs = ['Tienda', 'Productos', 'Comunidad'] as const;
type Tab = typeof tabs[number];

export default function PanelControl({ tienda, open, onClose, onTiendaUpdated }: Props) {
const [selectedTab, setSelectedTab] = useState<Tab>('Tienda');

useEffect(() => {
if (open && tienda) {
    setSelectedTab('Tienda');
}
}, [open]);

if (!open) return null;

return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 overflow-auto">
            <div
                className="bg-white dark:bg-background w-full max-w-max rounded-lg shadow-lg relative
                        opacity-0 scale-95 translate-y-4 animate-fade-in"
                role="dialog"
                aria-modal="true"
            >
                {/* Cabecera */}
                <div className="p-4 border-b flex justify-between items-center bg-primary rounded-t-lg">
                    <h2 className="text-lg font-semibold text-secondary-foreground">Panel: {tienda?.Name}</h2>
                    <button
                        onClick={onClose}
                        className="text-sm text-secondary-foreground hover:text-muted scale-125"
                    >
                        <XMarkIcon />
                    </button>
                </div>

                {/* Switch de tabs */}
                <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                    key={tab}
                    onClick={() => {
                        setSelectedTab(tab);
                    }}
                    className={`flex-1 p-2 text-sm font-medium transition border-b-2 ${
                        selectedTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-primary'
                    }`}
                    >
                    {tab}
                    </button>
                ))}
                </div>
                {/* Contenido dinámico */}
                <div className="p-6 transition-all duration-500 ease-in-out overflow-auto">
                    <div
                        key={selectedTab}
                        className={`${
                        selectedTab === 'Tienda'
                            ? 'animate-slide-left'
                            : selectedTab === 'Productos'
                            ? 'animate-slide-right'
                            : 'animate-slide-left'
                        }`}
                    >
                        {selectedTab === 'Tienda' && (
                        <div>
                            <FormTienda tienda={tienda} onTiendaUpdated={onTiendaUpdated} />
                        </div>
                        )}

                        {selectedTab === 'Productos' && (
                        <div>
                            <PanelControlProducto tienda={tienda} />
                        </div>
                        )}

                        {selectedTab === 'Comunidad' && (
                        <div>
                            <h3 className="text-md font-semibold mb-2">Comunidad</h3>
                            <Comunidad tienda={tienda} />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
