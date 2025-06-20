'use client';

import { useState } from 'react';
import { Loader2, Save, Store, CreditCard, Facebook, Instagram, Music, HelpCircle, Upload } from 'lucide-react';
import { Tienda } from '@/models/TiendaModel';
import Swal from 'sweetalert2';

// Mock data para la demo
interface Props {
    tienda: Tienda | null;
    onTiendaUpdated: (tienda: Tienda) => void;
}

export default function FormTienda({ tienda, onTiendaUpdated }: Props) {
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [form, setForm] = useState({
        ID: tienda?.ID || '',
        Name: tienda?.Name || '',
        DNI: tienda?.DNI || '',
        Logo: tienda?.Logo || '',
        Facebook: tienda?.Facebook || '',
        Instagram: tienda?.Instagram || '',
        TikTok: tienda?.TikTok || '',
        LinkStore: tienda?.LinkStore || '',
        IsGlobal: tienda?.IsGlobal || false
});

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const file = files && files[0];
        if (!file) return;

        // Simular carga de imagen
        const reader = new FileReader();
        reader.onload = (event) => {
        const result = event.target && typeof event.target.result === 'string' ? event.target.result : '';
        setForm(prev => ({
            ...prev,
            Logo: result
        }));
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setDisableSubmit(true);

        // Simular proceso de guardado
        setTimeout(() => {
        setDisableSubmit(false);
        alert('¡Tienda guardada exitosamente!');
        }, 2000);
    };

      const showIsGlobalHelp = () => {
        Swal.fire({
            title: '¿Qué es Mercado Comunidad?',
            html: `Es la tienda virtual donde se publicará tu tienda.<br><br>
                <a href="https://mercadocomunidad.cl" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">
                    https://mercadocomunidad.cl
                </a>`,
            icon: 'info',
            confirmButtonText: 'Entendido'
        });
    };


return (
        <div className="w-full max-w-5xl bg-background rounded-b-lg shadow border p-4">
            <div className="max-w-2xl mx-auto">
                <div className=" rounded-2xl p-4">
                <div className="space-y-4">
                    {/* Logo Upload */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative group">
                            <label htmlFor="logo-upload" className="cursor-pointer">
                            <div className="w-32 h-32 bg-blue-50 dark:bg-slate-700 border-2 border-dashed border-blue-300 dark:border-slate-500 rounded-xl flex items-center justify-center overflow-hidden relative transition-all duration-200 hover:border-blue-500 hover:bg-blue-100 dark:hover:bg-slate-600">
                                {form.Logo ? (
                                <>
                                    <img
                                    src={form.Logo}
                                    alt="Logo"
                                    className="object-cover w-full h-full rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl">
                                    <Upload className="h-6 w-6 text-white" />
                                    </div>
                                </>
                                ) : (
                                <span className="text-gray-400 text-sm text-center">Subir logo</span>
                                )}
                            </div>
                            </label>
                            <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            />
                        </div>
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                            type="text"
                            name="Name"
                            placeholder="Nombre"
                            required
                            value={form.Name}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-blue-50 dark:bg-slate-700 border border-blue-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-slate-600 text-slate-800 dark:text-slate-200"
                            />
                        </div>

                        {/* RUT */}
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                            type="text"
                            name="DNI"
                            placeholder="RUT (Sin puntos con guión)"
                            required
                            value={form.DNI}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-blue-50 dark:bg-slate-700 border border-blue-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-slate-600 text-slate-800 dark:text-slate-200"
                            />
                        </div>

                        {/* Facebook */}
                        <div className="relative">
                            <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                            <input
                            type="url"
                            name="Facebook"
                            placeholder="Facebook"
                            value={form.Facebook}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-blue-50 dark:bg-slate-700 border border-blue-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-slate-600 text-slate-800 dark:text-slate-200"
                            />
                        </div>

                        {/* Instagram */}
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-600 w-5 h-5" />
                            <input
                            type="url"
                            name="Instagram"
                            placeholder="Instagram"
                            value={form.Instagram}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-blue-50 dark:bg-slate-700 border border-blue-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-slate-600 text-slate-800 dark:text-slate-200"
                            />
                        </div>

                        {/* TikTok */}
                        <div className="relative md:col-span-2">
                            <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white w-5 h-5" />
                            <input
                            type="url"
                            name="TikTok"
                            placeholder="TikTok"
                            value={form.TikTok}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-blue-50 dark:bg-slate-700 border border-blue-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white dark:focus:bg-slate-600 text-slate-800 dark:text-slate-200"
                            />
                        </div>
                        </div>

                        {/* Checkbox para IsGlobal */}
                        <div className="flex items-center justify-center space-x-2 mt-4">
                        <input
                            type="checkbox"
                            name="IsGlobal"
                            id="IsGlobal"
                            checked={form.IsGlobal}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-blue-50 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label 
                            htmlFor="IsGlobal" 
                            className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer"
                        >
                            Publicar en Mercado Comunidad
                        </label>
                        <button
                            type="button"
                            onClick={showIsGlobalHelp}
                            className="text-blue-500 cursor-pointer"
                            title="¿Qué es esto?"
                        >
                            <HelpCircle size={18} />
                        </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={disableSubmit}
                            className={`w-full sm:w-auto px-8 py-3 font-semibold rounded-lg transition-all duration-200 transform ${
                            disableSubmit 
                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {disableSubmit ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin mr-2 w-5 h-5" />
                                Registrando...
                            </div>
                            ) : (
                            <div className="flex items-center justify-center">
                                <Save className="mr-2 w-5 h-5" />
                                Guardar
                            </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}