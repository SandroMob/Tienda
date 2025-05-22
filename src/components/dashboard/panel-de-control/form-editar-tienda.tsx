'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostTienda, PutTienda, Tienda } from '@/models/TiendaModel';
import axios from 'axios';

interface Props {
    tienda: Tienda | null;
}

export default function FormTienda({ tienda }: Props) {
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
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
        ...prev,
        [name]: value,
    }));
};

const tryPatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.token || !session?.user?._id || !tienda) return;
    setDisableSubmit(true);
    if(!form.ID && form.ID.length == 0){
        await PutTienda(session.user.token,form);
    } else {
        await PostTienda(session.user.token, session.user._id,form);
    }
    setDisableSubmit(false);
};

return (
    <div>
        <h2 className="font-bold mb-1 mt-3 text-primary">Editar Tienda</h2>
        <form onSubmit={tryPatch}>
            <div className="flex flex-col items-center justify-center p-3">
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 w-full max-w-2xl">
                    {[
                    { label: 'Nombre', name: 'Name', type: 'text' },
                    { label: 'RUT', name: 'DNI', type: 'text' },
                    { label: 'Facebook', name: 'Facebook', type: 'url' },
                    { label: 'Instagram', name: 'Instagram', type: 'url' },
                    { label: 'TikTok', name: 'TikTok', type: 'url' },
                    { label: 'Link de tienda', name: 'LinkStore', type: 'url' },
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
