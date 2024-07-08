import { AppRoles } from "../types/roles.types";

export interface User {
    id: string,
    email: string,
    token: string,
    iat: number,
    exp: number,
    role: AppRoles
}