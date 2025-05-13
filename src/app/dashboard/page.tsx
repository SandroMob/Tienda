'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tienda } from '@/models/TiendaModel';

export default function Dashboard() {
const { data: session } = useSession();
const [tiendas, setTiendas] = useState<Tienda[]>([]);
const [loading, setLoading] = useState(true);

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

return (
    <div className="min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
            <p>Cargando tiendas...</p>
        ) : (
            tiendas.map((tienda) => (
                <Card key={tienda.ID} className="shadow-md">
                <CardHeader>
                    <CardTitle>{tienda.Name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Enlace: {tienda.LinkStore}</p>
                </CardContent>
                </Card>
            ))
        )}
        </div>
    </div>
);
}
