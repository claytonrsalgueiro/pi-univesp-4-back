'use client';
import { PropsWithChildren, use } from 'react';
import { useAuth } from './AuthProvider';
import AccessDenied from '../(full-page)/(auth)/acesso-negado/page';
//import { LoggedUserInfo } from '../models/logged-user';

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {

    
    return children;
}
