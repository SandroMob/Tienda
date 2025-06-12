// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, apellido, email, pass } = body;

        // Validaciones básicas
        if (!nombre || !apellido || !email || !pass) {
            return NextResponse.json(
                { message: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "El formato del email no es válido" },
                { status: 400 }
            );
        }

        // Validación de contraseña
        if (pass.length < 6) {
            return NextResponse.json(
                { message: "La contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        // Llamada a APIGo
        const response = await axios.post(`${process.env.APIGO_URL}/register`, {
            nombre,
            apellido,
            email,
            pass,
        });

        // Si el registro es exitoso
        if (response.status === 200 || response.status === 201) {
            return NextResponse.json(
                {
                    message: "Usuario registrado exitosamente",
                    user: {
                        id: response.data.usuario?.id,
                        nombre: response.data.usuario?.nombre,
                        apellido: response.data.usuario?.apellido,
                        email: response.data.usuario?.email,
                    }
                },
                { status: 201 }
            );
        }

        if (response.status === 409) {

            return NextResponse.json(
                { message: "El email ya está registrado" },
                { status: 409 }
            );
        }

    } catch (error: any) {
        console.error('Error en registro:', error);

        // Manejo de errores específicos de la API
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;

            if (status === 409) {
                return NextResponse.json(
                    { message: "El email ya está registrado" },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { message: message || "Error al registrar usuario" },
                { status: status }
            );
        }

        // Error de conexión
        return NextResponse.json(
            { message: "Error de conexión con el servidor" },
            { status: 500 }
        );
    }
}