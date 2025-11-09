export interface LoggedUser {
    sub: string;
    idUsuario: number;
    tipoUsuario: UserRole;
    apelido: string;
    iat: number;
    exp: number;
}

export interface UserContext {
    data?: any | null;
    loggedUser?: LoggedUser | null;
}

export interface LoggedUserInfo {
    cliente?: any | null;
    foto?: any | null;
    loggedUser?: LoggedUser;
}

export enum UserRole {
    ADM = 'A',
    TEC = 'F',
    CLI = 'C'
}
