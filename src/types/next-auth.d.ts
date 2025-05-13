import "next-auth/jwt"; // Importar el módulo JWT

declare module "next-auth" {
  interface User {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    token: string;
  }

  interface Session {
    user: {
      _id?: string;
      nombre?: string;
      apellido?: string;
      email: string;
      token: string;
    };
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    token: string;
  }
}