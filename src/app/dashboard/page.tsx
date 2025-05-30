'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tienda } from '@/models/TiendaModel';
import CardTienda from '@/components/dashboard/card-tiendas';
import PanelControl from '@/components/dashboard/panel-de-control/panel';

export default function Dashboard() {
const { data: session } = useSession();
const [tiendas, setTiendas] = useState<Tienda[]>([]);
const [loading, setLoading] = useState(true);
const [modalOpen, setModalOpen] = useState(false);
const [tiendaModal, setTiendaModal] = useState<Tienda | null>(null);

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
        console.log(res);
        setTiendas(res.data);
    } catch (error) {
        console.error('Error al obtener tiendas:', error);
    }
    setLoading(false);
};

fetchTiendas();
}, []);

const openModal = (tienda: Tienda) => {
    setTiendaModal(tienda);
    setModalOpen(true);
};

const handleTiendaUpdated = (tiendaActualizada: Tienda) => {
    setTiendas(prevTiendas => {
        const exists = prevTiendas.some(t => t.ID === tiendaActualizada.ID);

        if (exists) {
        return prevTiendas.map(t =>
            t.ID === tiendaActualizada.ID ? tiendaActualizada : t
        );
        } else {
        return [...prevTiendas, tiendaActualizada];
        }
    });
};


return (
    <div className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 pr-6">

        {loading ? (
            <p>Cargando tiendas...</p>
        ) : (
            tiendas.map((tienda) => (
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
    </div>
);
}
