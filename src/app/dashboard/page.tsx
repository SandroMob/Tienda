'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 pr-6">
        {loading ? (
            <p>Cargando tiendas...</p>
        ) : (
            tiendas?.map((tienda) => (
                <Card key={tienda.ID} className="shadow-md">
                    <CardTienda tienda={tienda} openModal={() => openModal(tienda)} />
                </Card>
            ))
        )}
        </div>
        <PanelControl
            tienda={tiendaModal}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onTiendaUpdated={handleTiendaUpdated}
        />
        {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full relative overflow-hidden">
                {/* Cabecera */}
                <div className="border-b flex justify-between items-center bg-primary px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Tienda</h2>
                <button
                    onClick={closeFormModal}
                    className="text-white  transition"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4">
                <FormTienda
                    tienda={null}
                    onTiendaUpdated={(tienda) => {
                    handleTiendaUpdated(tienda);
                    closeFormModal();
                    }}
                />
                </div>
            </div>
        </div>
        )}
    </div>
);
}
