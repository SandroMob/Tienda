/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import axios from 'axios'


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials : {
                email : {label: "Correo", type: "email", placeholder : "user@user.com"},
                pass : {label: "Contraseña", type: "password", placeholder : "*********"}
            },
            async authorize(credentials) {
                const { email, pass } = credentials || {};
                if (!email || !pass) return null;
                try {
                    const resp = await axios.post(`${process.env.APIGO_URL}/auth`, {
                        email,
                        pass,
                    });
                    return {
                        id: resp?.data.usuario.id,
                        nombre: resp?.data.usuario.nombre,
                        apellido: resp?.data.usuario.apellido,
                        email: email ?? "", // asegúrate que no sea undefined
                        token: resp?.data.token,
                    };
                } catch (error) {
                    return null;
                }
            }
        }),
    ],
    secret :  process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.nombre = user.nombre;
                token.apellido = user.apellido;
                token.api_token = user.token
            }
            return token;
        },
        async session({ session, token }) {
                session.user = {
                _id: String(token.id),
                email: token.email || "",
                nombre: String(token.nombre || ""),
                apellido:String(token.apellido || ""),
                token : String(token.api_token)
            };
            return session;
        },
    },
    pages :{
        signIn : '/login'
    }
});

export {handler as GET, handler as POST}