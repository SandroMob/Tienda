'use client';

import { Tienda } from '@/models/TiendaModel';
import { TikTokIcon, FacebookIcon, InstagramIcon, LinkIcon, LayoutIcon } from '../ui/localIcons';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Props {
    tienda: Tienda;
    openModal: () => void;
}

export default function TiendaCard({ tienda, openModal }: Props) {
    const socialLinks = [
        { url: tienda.Facebook, icon: FacebookIcon, color: 'text-blue-600 hover:text-blue-700', bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20' },
        { url: tienda.Instagram, icon: InstagramIcon, color: 'text-pink-500 hover:text-pink-600', bgColor: 'hover:bg-pink-50 dark:hover:bg-pink-900/20' },
        { url: tienda.TikTok, icon: TikTokIcon, color: 'text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white', bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-800' },
        { url: tienda.LinkStore, icon: LinkIcon, color: 'text-indigo-600 hover:text-indigo-700', bgColor: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20' }
    ].filter(link => link.url);

    return (
        <div className="relative h-full flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50">
            {/* Header con gradiente */}
            <div className="relative p-6 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
                
                <div className="relative flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 truncate">
                            {tienda.Name}
                        </h2>
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                RUT: {tienda.DNI}
                            </span>
                        </div>
                    </div>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            size="sm" 
                            onClick={openModal}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <LayoutIcon className="w-4 h-4 mr-1" />
                            Gestionar
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-6 pt-4">
                {/* Información adicional - puedes agregar más campos aquí */}
                <div className="space-y-3">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p className="line-clamp-2">
                            Gestiona productos, configura tu tienda y conecta con la comunidad.
                        </p>
                    </div>
                    
                    {/* Estadísticas o métricas rápidas - placeholder */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200/50 dark:border-green-700/50">
                            <div className="text-lg font-semibold text-green-700 dark:text-green-400">--</div>
                            <div className="text-xs text-green-600 dark:text-green-500">Productos</div>
                        </div>
                        {/* <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50">
                            <div className="text-lg font-semibold text-blue-700 dark:text-blue-400">--</div>
                            <div className="text-xs text-blue-600 dark:text-blue-500">Ventas</div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Footer con redes sociales */}
            {socialLinks.length > 0 && (
                <div className="mt-auto border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Redes Sociales
                        </span>
                        <div className="flex items-center space-x-2">
                            {socialLinks.map((link, index) => {
                                const IconComponent = link.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full transition-all duration-200 ${link.color} ${link.bgColor} group relative`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <LinkIcon className="w-2 h-2 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Indicador de hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
}