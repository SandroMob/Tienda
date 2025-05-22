'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Producto,PostProducto, PutProducto } from '@/models/ProductoModel'; // ajusta path según tu proyecto
import { Tienda } from '@/models/TiendaModel';
interface Props {
    producto?: Producto | null;
    tienda: Tienda;
}

export default function FormProducto({ producto, tienda}: Props) {
    const [disableSubmit, setDisableSubmit] = useState(false);
    const { data: session} = useSession();

    const [form, setForm] = useState<Producto>({
        id:producto?.id || '',
        title: producto?.title || '',
        description: producto?.description || '',
        longDescription: producto?.longDescription || '',
        price: producto?.price || 0,
        images: producto?.images || [],
        phone: producto?.phone || '',
        storeName: producto?.storeName || '',
        storeDNI: producto?.storeDNI || '',
        storeLogo: producto?.storeLogo || '',
        facebookLink: producto?.facebookLink || '',
        instagramLink: producto?.instagramLink || '',
        categoria: producto?.categoria || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleImageListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({
        ...prev,
        images: value.split(',').map((url) => url.trim()),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.token || !tienda?.ID) return;
        const hasValidID = form.id && form.id.trim().length === 24;
        console.log(form);
        if (hasValidID) {
            console.log("Entra a put");
            await PutProducto(session.user.token, form, tienda.ID);
        } else {
            console.log("Entra a post");
            await PostProducto(session.user.token, form, tienda.ID);
        }
        setDisableSubmit(true);
        setDisableSubmit(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 w-full mx-auto py-4">
                {[
                { label: 'Título', name: 'title', type: 'text' },
                { label: 'Descripción corta', name: 'description', type: 'text' },
                { label: 'Descripción larga', name: 'longDescription', type: 'textarea' },
                { label: 'Precio', name: 'price', type: 'number' },
                { label: 'Teléfono', name: 'phone', type: 'text' },
                { label: 'Facebook', name: 'facebookLink', type: 'url' },
                { label: 'Instagram', name: 'instagramLink', type: 'url' },
                { label: 'Categoría', name: 'categoria', type: 'text' },
                ].map(({ label, name, type }) => (
                <div key={name}>
                    <label className="block text-sm text-primary mb-1">{label}</label>
                    {type === 'textarea' ? (
                    <textarea
                        name={name}
                        required
                        rows={1}
                        value={(form as any)[name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2"
                    />
                    ) : (
                    <input
                        type={type}
                        name={name}
                        required={name !== 'facebookLink' && name !== 'instagramLink'}
                        value={(form as any)[name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2"
                    />
                    )}
                </div>
                ))}
            </div>

            <div className="flex justify-end pb-6">
                <Button
                type="submit"
                variant="outline"
                className="text-primary border-primary"
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
    );
}
