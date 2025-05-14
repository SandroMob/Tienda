'use client';

import { Tienda } from '@/models/TiendaModel';
import { TikTokIcon, FacebookIcon, InstagramIcon, LinkIcon } from '../ui/localIcons';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    tienda: Tienda;
}

const colores = [
    'from-blue-500 to-blue-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700',
    'from-sky-500 to-sky-700',
    'from-purple-500 to-purple-700',
];

const getRandomGradient = () =>
  colores[Math.floor(Math.random() * colores.length)];

export default function CardTienda({ tienda }: Props) {
    const fondo = tienda.Logo ? '' : getRandomGradient();

    return (
        <div className="w-full max-w-3xl mx-auto rounded-xl shadow-lg flex overflow-hidden bg-muted">
        {/* Fondo izquierdo */}
        <div
            className={cn(
            'w-1/3 min-h-[220px] relative',
            tienda.Logo ? '' : `bg-gradient-to-br ${fondo}`
            )}
        >
            {/* {tienda.Logo && (
            <Image
                src={tienda.Logo}
                alt="Logo"
                fill
                className="object-cover"
            />
            )} */}
        </div>

        {/* Contenido derecho */}
        <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
            <h2 className="text-2xl font-bold text-primary">{tienda.Name}</h2>
            <p className="text-sm text-muted-foreground">RUT: {tienda.DNI}</p>
            </div>

            {/* Redes sociales */}
            <div className="flex items-center space-x-4 mt-4">
            {tienda.Facebook && (
                <a href={tienda.Facebook} target="_blank" rel="noreferrer">
                <FacebookIcon className="h-5 w-5 text-blue-600 hover:scale-110 transition" />
                </a>
            )}
            {tienda.Instagram && (
                <a href={tienda.Instagram} target="_blank" rel="noreferrer">
                <InstagramIcon className="h-5 w-5 text-pink-500 hover:scale-110 transition" />
                </a>
            )}
            {tienda.TikTok && (
                <a href={tienda.TikTok} target="_blank" rel="noreferrer">
                <TikTokIcon className="h-5 w-5 text-black hover:scale-110 transition" />
                </a>
            )}
            {tienda.LinkStore && (
                <a href={tienda.LinkStore} target="_blank" rel="noreferrer">
                <LinkIcon className="h-5 w-5 text-primary hover:scale-110 transition" />
                </a>
            )}
            </div>

            {/* Botones a la derecha */}
            <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary">Editar Empresa</Button>
            <Button>Crear Producto</Button>
            </div>
        </div>
        </div>
    );
}
