'use server';
import { decodeJwt } from 'jose';
import { cache } from 'react';
import { getSession } from '../lib/session';
import { LoggedUser, LoggedUserInfo, UserRole } from '../models/logged-user';
import { User } from '../models/user';
import xiorInstance from '../api/xior-instance';
import { redirect } from 'next/navigation';

const getLoggedUser = async (): Promise<LoggedUser | null> => {
    const session = await getSession();
    if (!session) return null;

    return {
        sub: '',
        idUsuario: 1,
        tipoUsuario: UserRole.ADM,
        apelido: 'teste',
        iat: 45641321321,
        exp: 12434321321,
    };
};

export const getLoggedUserInfo = cache(async () => {
    const loggedUser = await getLoggedUser();

    if (!loggedUser) {
        redirect('/login');
    } else {
        const response = await xiorInstance
            .get<User>(`/data/api/v1/user?login=${loggedUser.sub.toLowerCase()}`)
            .then((res) => {
                return {
                    data: {
                        foto: res.data.foto,
                        cliente: { apelido: res.data.cliente.apelido, id: res.data.cliente.id },
                        loggedUser: loggedUser
                    } as LoggedUserInfo
                };
            })
            .catch((error) => error);

        if (response?.status !== 401) {
            return response;
        } else {
            redirect('/login');
        }
    }
});
