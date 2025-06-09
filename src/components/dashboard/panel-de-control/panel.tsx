'use client';

import { useState, useEffect, useRef } from 'react';
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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRefs = useRef<{ [key in Tab]?: HTMLDivElement }>({});

    useEffect(() => {
        if (open && tienda) {
            setSelectedTab('Tienda');
        }
    }, [open]);

    // Función para medir el contenido real de cada tab
    const measureContent = (tab: Tab): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            const element = contentRefs.current[tab];
            if (!element) {
                resolve({ width: 500, height: 400 });
                return;
            }

            // Forzar el render y luego medir
            requestAnimationFrame(() => {
                const rect = element.getBoundingClientRect();
                resolve({
                    width: Math.max(400, rect.width + 48), // +48 para padding
                    height: Math.max(300, rect.height + 120) // +120 para header y padding
                });
            });
        });
    };

    // Transición suave entre tabs
    const handleTabChange = async (newTab: Tab) => {
        if (newTab === selectedTab || isTransitioning) return;
        
        setIsTransitioning(true);
        
        if (!containerRef.current) return;
        
        // Obtener dimensiones actuales
        const currentRect = containerRef.current.getBoundingClientRect();
        const currentWidth = currentRect.width;
        const currentHeight = currentRect.height;
        
        // Fijar dimensiones actuales
        containerRef.current.style.width = `${currentWidth}px`;
        containerRef.current.style.height = `${currentHeight}px`;
        containerRef.current.style.transition = 'none';
        
        // Pequeña pausa
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Cambiar el contenido (invisible)
        setSelectedTab(newTab);
        
        // Esperar a que se renderice el nuevo contenido
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Medir nuevo contenido
        const newDimensions = await measureContent(newTab);
        
        // Aplicar transición suave
        containerRef.current.style.transition = 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        containerRef.current.style.width = `${newDimensions.width}px`;
        containerRef.current.style.height = `${newDimensions.height}px`;
        
        // Liberar estilos después de la transición
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.style.width = 'auto';
                containerRef.current.style.height = 'auto';
                containerRef.current.style.transition = '';
            }
            setIsTransitioning(false);
        }, 450);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 overflow-auto">
            <div
                ref={containerRef}
                className="bg-white dark:bg-background rounded-lg shadow-lg relative
                        opacity-0 scale-95 translate-y-4 animate-fade-in"
                style={{
                    minWidth: '400px',
                    maxWidth: '90vw',
                    minHeight: '300px'
                }}
                role="dialog"
                aria-modal="true"
            >
                {/* Contenido oculto para medición */}
                <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
                    {tabs.map((tab) => (
                        <div
                            key={`measure-${tab}`}
                            ref={(el) => {
                                if (el) contentRefs.current[tab] = el;
                            }}
                            className="p-6"
                        >
                            {tab === 'Tienda' && <FormTienda tienda={tienda} onTiendaUpdated={onTiendaUpdated} />}
                            {tab === 'Productos' && <PanelControlProducto tienda={tienda} />}
                            {tab === 'Comunidad' && (
                                <div>
                                    <h3 className="text-md font-semibold mb-2">Comunidad</h3>
                                    <Comunidad tienda={tienda} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Cabecera */}
                <div className="p-4 border-b flex justify-between items-center bg-primary rounded-t-lg">
                    <h2 className="text-lg font-semibold text-secondary-foreground">Panel: {tienda?.Name}</h2>
                    <button
                        onClick={onClose}
                        className="text-sm text-secondary-foreground hover:text-muted scale-125 transition-transform duration-200"
                    >
                        <XMarkIcon />
                    </button>
                </div>

                {/* Switch de tabs */}
                <div className="flex border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            disabled={isTransitioning}
                            className={`flex-1 p-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                                selectedTab === tab
                                    ? 'border-primary text-primary bg-primary/5'
                                    : 'border-transparent text-muted-foreground hover:text-primary hover:bg-muted/30'
                            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Contenido visible */}
                <div className="overflow-hidden">
                    <div
                        className={`p-6 transition-all duration-300 ease-in-out ${
                            isTransitioning 
                                ? 'opacity-40 transform scale-98' 
                                : 'opacity-100 transform scale-100'
                        }`}
                    >
                        {selectedTab === 'Tienda' && (
                            <div className="animate-fade-in-up">
                                <FormTienda tienda={tienda} onTiendaUpdated={onTiendaUpdated} />
                            </div>
                        )}

                        {selectedTab === 'Productos' && (
                            <div className="animate-fade-in-up">
                                <PanelControlProducto tienda={tienda} />
                            </div>
                        )}

                        {selectedTab === 'Comunidad' && (
                            <div className="animate-fade-in-up">
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