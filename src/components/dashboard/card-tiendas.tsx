'use client';

import { Tienda } from '@/models/TiendaModel';
import { TikTokIcon,FacebookIcon,InstagramIcon,LinkIcon,LayoutIcon } from '../ui/localIcons';
import { Button } from '@/components/ui/button';

interface Props {
    tienda: Tienda;
    openModal: () => void;
}

export default function TiendaCard({ tienda, openModal }: Props) {
    return (
        <div className="w-full max-w-md bg-background flex flex-col overflow-hidden">
        {/* Parte superior */}
            <div className="flex justify-between p-4">
                <div>
                    <h2 className="text-xl font-bold text-primary">{tienda.Name}</h2>
                    <p className="text-sm text-muted-foreground">RUT: {tienda.DNI}</p>
                </div>
                <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="default" onClick={openModal}><LayoutIcon /></Button>
                </div>
            </div>
            {/* Separador */}
            <div className="border-t" />
            {/* Iconos sociales en la parte inferior */}
            <div className="flex justify-around items-center py-3 bg-muted">
                {tienda.Facebook && (
                <a href={tienda.Facebook} target="_blank" rel="noreferrer">
                    <FacebookIcon className="h-5 w-5 text-blue-600 hover:scale-110 transition" />
                </a>
                )}
                {tienda.Instagram && (
                <a href={tienda.Instagram} target="_blank" rel="noreferrer">
                    <InstagramIcon className="h-5 w-5 text-pink-500 hover:scale-110 transition" color='text-pink-500'/>
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
        </div>
    );
}
