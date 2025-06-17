'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Tienda } from '@/models/TiendaModel';
import CardTienda from '@/components/dashboard/card-tiendas';
import PanelControl from '@/components/dashboard/panel-de-control/panel';
import FormTienda from '@/components/dashboard/panel-de-control/panel-tienda/form-editar-tienda';
import { StoreIcon, XMarkIcon } from '@/components/ui/localIcons';

export default function Dashboard() {
const { data: session } = useSession();
const [tiendas, setTiendas] = useState<Tienda[]>([]);
const [loading, setLoading] = useState(true);
const [modalOpen, setModalOpen] = useState(false);
const [tiendaModal, setTiendaModal] = useState<Tienda | null>(null);
const [showFormModal, setShowFormModal] = useState(false);

useEffect(() => {
const fetchTiendas = async () => {
    if (!session?.user?._id) return;
    try {
        const url= `${process.env.NEXT_PUBLIC_APIGO_URL}/api/tiendas/${session.user._id}`;
        const res = await axios.get(url, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${session.user.token}`,
        },
        });
        setTiendas(res.data);
    } catch (error) {
        console.error('Error al obtener tiendas:', error);
    }
    setLoading(false);
};

fetchTiendas();
}, []);


const openFormModal = (tienda: Tienda | null) => {
    setTiendaModal(tienda);
    setShowFormModal(true);
};

const closeFormModal = () => {
    setTiendaModal(null);
    setShowFormModal(false);
};

const openModal = (tienda: Tienda | null) => {
    setTiendaModal(tienda);
    setModalOpen(true);
};

const handleTiendaUpdated = (tiendaActualizada: Tienda) => {
    setTiendas(prevTiendas => {
        const tiendasList = prevTiendas ?? [];
        const exists = tiendasList.some(t => t.ID === tiendaActualizada.ID);
        if (exists) {
            return tiendasList.map(t =>
                t.ID === tiendaActualizada.ID ? tiendaActualizada : t
            );
        } else {
            return [...tiendasList, tiendaActualizada];
        }
    });
};

// Estado vacío cuando no hay tiendas
const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-6">
        <div className="text-center">
            <StoreIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
                No tienes tiendas creadas
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
                Comienza creando tu primera tienda para gestionar tus productos y ventas.
            </p>
            <button
                onClick={() => openFormModal(null)}
                className="bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary/90 transition flex items-center gap-2 mx-auto"
            >
                <StoreIcon className="w-4 h-4" />
                Crear mi primera tienda
            </button>
        </div>
    </div>
);

return (
    <div className="min-h-screen">
        <div className="flex justify-end px-6 mb-4">
            <button
                onClick={() => openFormModal(null)}
                className="bg-primary text-white font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition flex items-center gap-2"
            >
                <StoreIcon className="w-4 " />
                Crear Tienda
            </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 [@media(min-width:1050px)]:grid-cols-3 [@media(min-width:1280px)]:grid-cols-4 gap-6 pr-6">
        {loading ? (
            <div className="col-span-full flex justify-center py-8">
                <p>Cargando tiendas...</p>
            </div>
        ) : tiendas && tiendas.length > 0 ? (
            tiendas.map((tienda) => (
                <Card key={tienda.ID} className="shadow-md">
                    <CardTienda tienda={tienda} openModal={() => openModal(tienda)} />
                </Card>
            ))
        ) : (
            <EmptyState />
        )}
        </div>
        
        <PanelControl
            tienda={tiendaModal}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onTiendaUpdated={handleTiendaUpdated}
        />
        {showFormModal && (
            <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-start justify-center overflow-auto pt-10 px-4 rounded-t-lg">
                <div
                    className="bg-background dark:bg-neutral-900 rounded-b-lg shadow-2xl w-full max-w-5xl animate-fade-in transition-all duration-300 inset-0"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b flex justify-between items-center bg-primary rounded-t-lg">
                        <h2 className="text-lg font-semibold text-primary-foreground dark:text-yellow-50">Crear Tienda</h2>
                        <button
                            onClick={closeFormModal}
                            className="text-secondary transition-transform scale-110"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Contenido */}
                    <FormTienda
                        tienda={null}
                        onTiendaUpdated={(tienda) => {
                            handleTiendaUpdated(tienda);
                            closeFormModal();
                        }}
                    />
                </div>
            </div>
        )}
    </div>
);
}