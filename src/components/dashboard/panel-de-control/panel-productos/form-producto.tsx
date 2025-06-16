'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Producto,PostProducto, PutProducto } from '@/models/ProductoModel'; // ajusta path según tu proyecto
import { Tienda } from '@/models/TiendaModel';
import ImageUploader from './image-uploader';
import axios from 'axios';
import { GetUserPlanDetails, Plan } from '@/models/PlanesModel';
interface Props {
    producto?: Producto | null;
    tienda: Tienda;
}

export default function FormProducto({ producto, tienda}: Props) {
    const [disableSubmit, setDisableSubmit] = useState(false);
    const { data: session} = useSession();
    const [categorias, setCategorias] = useState<{ _id: string; name: string }[]>([]);
    const [limiteImagenes, setLimiteImagenes] = useState(0);

    useEffect(() => {
    const fetchCategorias = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_APIGO_URL}/api/categories`, {
                headers: {
                Authorization: `Bearer ${session?.user?.token}`,
                },
            });
            setCategorias(res.data);
            const respPlan = await GetUserPlanDetails(session?.user?.token || '', session?.user?._id || '') as Plan;
            setLimiteImagenes(respPlan.max_images_per_publication);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    };

    fetchCategorias();
    }, []);

    const [form, setForm] = useState<Producto>({
        id:producto?.id || '',
        title: producto?.title || '',
        description: producto?.description || '',
        longDescription: producto?.longDescription || '',
        price: producto?.price || 0,
        images: producto?.images || [],
        categoria: producto?.categoria || '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {

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
            //Cambio acá, ahora mandar id de usuario
            await PostProducto(session.user.token, form, tienda.ID, session.user._id? session.user._id : '');
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
                <div>
                    <label className="block text-sm text-primary mb-1">Categoría</label>
                    <select
                        name="categoria"
                        required
                        value={form.categoria}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2"
                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                        ))}
                    </select>
                </div>
            </div>
            <ImageUploader
                images={form.images}
                limit={limiteImagenes}
                onChange={(imgs) => setForm((prev) => ({ ...prev, images: imgs }))}
            />
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
