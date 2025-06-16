'use client';

import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { X, Upload, GripVertical } from 'lucide-react';
import { toast } from 'nextjs-toast-notify';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  limit?: number; // Opcional, para limitar el número de imágenes
}

export default function ImageUploader({ images, onChange, limit }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(limit);
    const file = e.target.files?.[0];
    if (!file) return;
    // Validar si se ha alcanzado el límite de imágenes
    if (limit && images.length >= limit) {
      toast.warning(`Llegaste al límite de imágenes por producto. (Limite de plan ${limit})`, {
          duration: 3000,
          progress: true,
          position: "top-center",
          transition: "fadeIn",
      });
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        toast.info("El archivo compartido no es una imágen, prueba con otro!", {
          duration: 3000,
          progress: true,
          position: "top-center",
          transition: "fadeIn",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.info("El archivo es demasiado grande. Máximo 5MB", {
          duration: 3000,
          progress: true,
          position: "top-center",
          transition: "fadeIn",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    formData.append('folder', 'productos');

    try {

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setUploadProgress(progress);
            }
          },
        }
      );

      if (res.data.secure_url) {
        onChange([...images, res.data.secure_url]);
      }
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img === active.id);
      const newIndex = images.findIndex((img) => img === over?.id);
      const sorted = arrayMove(images, oldIndex, newIndex);
      onChange(sorted);
    }
  };

  return (
    <div className="space-y-4">
      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{uploadProgress}% completado</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Arrastra las imágenes para reordenarlas. La primera será la imagen principal.
        </p>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  index={index}
                  isFirst={index === 0}
                  onRemove={() => handleRemove(index)}
                />
              ))}

              {/* Zona de subida como un cuadrado más */}
              <label className={`
                cursor-pointer relative rounded-lg border-2 border-dashed border-gray-300
                hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
                flex flex-col items-center justify-center h-32 bg-gray-50
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 font-medium">
                  {uploading ? 'Subiendo...' : 'Subir Imagen'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableImage({
  url,
  index,
  isFirst,
  onRemove
}: {
  url: string;
  index: number;
  isFirst: boolean;
  onRemove: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg overflow-hidden border-2 shadow-sm cursor-grab active:cursor-grabbing ${
        isFirst ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
      }`}
    >
      {/* Indicador de imagen principal */}
      {isFirst && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
          Principal
        </div>
      )}

      {/* Handle para arrastrar */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-8 bg-black bg-opacity-50 text-white rounded p-1 hover:bg-opacity-75 cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical size={14} />
      </div>

      {/* Botón eliminar */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-500 bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-100 z-10"
        type="button"
      >
        <X size={14} />
      </button>

      <img
        src={url}
        alt={`Imagen ${index + 1}`}
        className="w-full h-32 object-cover"
      />
      {/* Número de orden */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        #{index + 1}
      </div>
    </div>
  );
}