export interface UserRef {
    userID: string;
    role: string;
}

export interface Tienda {
    ID: string;
    Name: string;
    DNI: string;
    Logo: string;
    Facebook: string;
    Instagram: string;
    TikTok: string;
    LinkStore: string;
    users: UserRef[];
}
