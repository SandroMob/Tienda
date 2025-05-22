'use client';

import { useState, useEffect} from 'react';
import { Tienda } from '@/models/TiendaModel';
import { LayoutIcon,TableIcon  } from '@/components/ui/localIcons';
import { Producto,GetProductosTienda } from '@/models/ProductoModel';
import FormProducto from './form-producto';
import TablaProductos from './tabla-productos';
import { useSession } from 'next-auth/react';
interface Props {
    tienda: Tienda | null;
}

type Tab = 'form' | 'table';

export default function PanelControlProducto({ tienda }: Props) {
    const [selectedTab, setSelectedTab] = useState<Tab>('form');
    const [producto, setProducto] = useState<Producto | null>(null);
    const [productoList, setProductoList] = useState<Producto[] | null>(null);
    const { data: session} = useSession();

    useEffect(() => {
        //CREAR FUNCION EN USEFFECT PARA TRAER LOS DATOS... PD NO SE EJECUTA ACÁ, SE CREA. SE EJECUTA AL FINAL DEL USEFFECT
        const getProductos = async () => {
            if (selectedTab != 'table') return;//VALIDACIÓN PARA QUE SE HAGA LA CONSULTA DE PRODUCTOS AL ABRIR EL TAB DE TABLE
            if (!session?.user?._id ) return; // VALIDACIÓN PARA OBTENER LA SESSIÓN DEL USUARIO
            if (!tienda) return; // VALIDACIÓN PARA GARANTIZAR QUE SE PASÓ LA TIENDA AL OBJETO
            try {
                //LLAMADO AL INTERFACE DE PRODUCTO PARA LLAMAR EL LISTADO POR TIENDA CON FILTRO DE PALABRA CLAVE
                const res = await GetProductosTienda(session.user.token, tienda.ID, "")
                console.log(res);
                setProductoList(res);//SETEO DE VARIABLE QUE CONTIENE EL LISTADO DE PRODUCTOS, QUE ES LA QUE ALIMENTA EL COMPONENTE DE TABLA
            } catch (error) {
                console.error('Error al obtener tiendas:', error);
            }
        };
    //EJECUTAR GET PRODUCTOS
    getProductos();
    }, [selectedTab]);//ESTO ES PARA QUE EL USEFFECT ESE EJECUTE CADA VEZ QUE DETECTE UN CAMBIO EN EL STATE DEL TAB SELECCIONADO, EN EL ALTERNADO DE PANTALLAS

    return (
        <div className="w-full max-w-5xl bg-background rounded-lg shadow border p-4">
        {/* Tabs con iconos */}
        <div className="flex border-b mb-4">
            <button
                onClick={() => {
                    setSelectedTab('form');
                    setProducto(null);
                }}
                className={`flex-1 p-2 flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition ${
                    selectedTab === 'form'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-primary'
                }`}
            >
            <LayoutIcon className="h-4 w-4" />
                Formulario Producto
            </button>
            <button
            onClick={() => setSelectedTab('table')}
            className={`flex-1 p-2 flex items-center justify-center gap-2 text-sm font-medium border-b-2 transition ${
                selectedTab === 'table'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
            >
            <TableIcon className="h-4 w-4" />
                Listado
            </button>
        </div>

        {/* Contenido dinámico */}
        <div className="p-2">
            {selectedTab === 'form' && tienda && <FormProducto producto={producto} tienda={tienda}/>}
            {selectedTab === 'table' && (
                <TablaProductos
                    productos={productoList}
                    onEditar={(producto) => {
                        console.log("on editar");
                        console.log(producto);
                        setProducto({
                            ...producto,
                            id: producto.id ?? '',
                        });
                    setSelectedTab('form');
                    }}

                />
            )}
        </div>
        </div>
    );
}
