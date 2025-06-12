'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostTienda, PutTienda, Tienda } from '@/models/TiendaModel';
import axios from 'axios';
import { FileEditIcon } from '@/components/ui/localIcons';
import Swal from 'sweetalert2';
import { HelpCircle } from 'lucide-react';

interface Props {
    tienda: Tienda | null;
    onTiendaUpdated: (tienda: Tienda) => void;
}

export default function FormTienda({ tienda, onTiendaUpdated }: Props) {
    const [disableSubmit, setDisableSubmit] = useState(false);
    const { data: session } = useSession();

    const [form, setForm] = useState<Tienda>({
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
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
        formData.append('folder', 'tiendas');

        try {
            const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
            );

            if (res.data.secure_url) {
            setForm(prev => ({
                ...prev,
                Logo: res.data.secure_url,
            }));
            }
        } catch (error) {
            console.error('Error al subir imagen a Cloudinary:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const tryPatch = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (!session?.user?.token || !session?.user?._id) return;
            setDisableSubmit(true);
            if (!form.ID || form.ID.length === 0) {
                //si crea una nueva tienda espera la respuesta del backend para agregar la tienda al listado precargado
                const nuevaTienda = await PostTienda(session.user.token, session.user._id, form);
                if (nuevaTienda != null) {
                    onTiendaUpdated(nuevaTienda);// <-- acá se agrega al listado
                }
            } else {
                //si edita la tienda al  editar en e backend se pasan los cambios al objeto que ya está en el array, para no ahcer una nueva carga
                await PutTienda(session.user.token, form);
                onTiendaUpdated(form);
            }
            setDisableSubmit(false);
        } catch (error) {
            console.error('Error al guardar tienda:', error);
        }
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
        <div>
            <h2 className="font-bold mb-1 mt-3 text-primary">{tienda?.ID ? 'Editar' : 'Crear'} Tienda</h2>
            <form onSubmit={tryPatch}>
                <div className="flex flex-col items-center justify-center p-3">
                    <div className="flex justify-center mb-6 relative">
                        <label htmlFor="logo-upload" className="cursor-pointer relative group">
                            <div className="w-32 h-32 bg-zinc-200 border-2 border-dashed border-gray-400 rounded-[25px] flex items-center justify-center overflow-hidden relative">
                            {form.Logo ? (
                                <>
                                <img
                                    src={form.Logo}
                                    alt=""
                                    className="object-cover w-full h-full rounded-[25px] transition"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <FileEditIcon className="h-6 w-6 text-white" />
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
                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 w-full max-w-2xl">
                        {[
                        { label: 'Nombre', name: 'Name', type: 'text' },
                        { label: 'RUT (Sin puntos con guión)', name: 'DNI', type: 'text' },
                        { label: 'Facebook', name: 'Facebook', type: 'url' },
                        { label: 'Instagram', name: 'Instagram', type: 'url' },
                        { label: 'TikTok', name: 'TikTok', type: 'url' },
                        ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-sm text-primary">{label}</label>
                            <input
                            type={type}
                            name={name}
                            onChange={handleChange}
                            required
                            value={(form as any)[name] || ''}
                            className="w-full px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2"
                            />
                        </div>
                        ))}
                        {/* Checkbox para IsGlobal */}
                        <div className="mt-4 flex items-center justify-center space-x-2">
                            <input
                                type="checkbox"
                                name="IsGlobal"
                                id="IsGlobal"
                                checked={form.IsGlobal}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="IsGlobal" className="text-sm text-primary cursor-pointer">
                                Publicar en Mercado Comunidad
                            </label>
                            <span title="¿Qué es esto?">
                                <HelpCircle
                                    size={18}
                                    className="text-blue-500 cursor-pointer"
                                    onClick={showIsGlobalHelp}
                                />
                            </span>
                        </div>

                    </div>
                </div>

                <div className="mb-1 mt-3 flex justify-end p-3">
                    <Button
                        type="submit"
                        variant="outline"
                        className="text-primary border-primary w-full sm:w-auto"
                        disabled={disableSubmit}
                    >
                        {disableSubmit ? (
                        <Loader2 className="animate-spin mr-2" width={20} height={20} />
                        ) : (
                        <div className="flex items-center gap-2">
                            Guardar <Save size={18} />
                        </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}