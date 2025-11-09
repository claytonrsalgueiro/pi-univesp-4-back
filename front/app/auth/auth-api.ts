'use server';
import { XiorResponse } from 'xior';
import { deleteSession, getSession } from '@/lib/session';
import xiorInstance from '@/api/xior-instance';

interface Response {
    token?: string;
}

export async function login(username: string, password: string): Promise<XiorResponse<Response>> {
    return xiorInstance.post(`/auth-service/api/login?username=${username}&password=${password}`, null);
}

export async function logout() {
    deleteSession();
}

export async function getSessionInfo() {
    return getSession();
}
