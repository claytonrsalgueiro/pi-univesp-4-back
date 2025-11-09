'use client';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Page } from '../../../../types/layout';
import { Divider } from 'primereact/divider';
import Image from 'next/image';
import logo from '@/public/layout/images/logo_novo.png';
import { signIn } from '@/app/actions/signin';
import { Message } from 'primereact/message';
import ForgotPassword from './ForgotPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginFormSchema, LoginFormSchema } from '@/app/lib/definitions/login-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/providers/ToastProvider';

const Login: Page = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (values: LoginFormSchema) => {
    try {
      const result = await signIn({ username: values.username, password: values.password });

      if (result.ok) {
        // Cookie "session" foi criado no server (createSession)
        router.push('/meteo');
      } else {
        showToast({
          detail: result.error || 'Não foi possível autenticar',
          severity: 'error',
        });
      }
    } catch (err: any) {
      showToast({
        detail: err?.message || 'Erro inesperado ao autenticar',
        severity: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div className="flex flex-column align-items-center justify-content-center">
          <Image src={logo} alt="logo" height={60} priority />
          <div
            style={{
              borderRadius: '56px',
              padding: '0.3rem',
              background:
                'linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)',
            }}
          >
            <div
              className="w-full surface-card py-5 px-5 sm:px-8"
              style={{ borderRadius: '53px' }}
            >
              <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Bem-vindo!</div>
                <span className="text-600 font-medium">Faça login para continuar</span>
              </div>

              <div>
                <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                  Usuário
                </label>
                <InputText id="username" type="text" placeholder="Seu usuário"
                  className="w-full md:w-30rem mb-2"
                  {...register('username')}
                />
                {errors?.username && (
                  <Message className="mt-1" severity="error" text={errors?.username?.message} />
                )}

                <label htmlFor="password" className="block text-900 font-medium text-xl mt-3 mb-2">
                  Senha
                </label>
                <InputText id="password" type="password" placeholder="••••••••"
                  className="w-full md:w-30rem mb-2"
                  {...register('password')}
                />
                {errors?.password && (
                  <Message className="mt-1" severity="error" text={errors?.password?.message} />
                )}
              </div>

              <Button
                label="Entrar"
                type="submit"
                className="w-full mt-4"
                icon="pi pi-lock-open"
                iconPos="left"
                disabled={isSubmitting}
              />
              <Divider type="dashed" />
              <ForgotPassword />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
