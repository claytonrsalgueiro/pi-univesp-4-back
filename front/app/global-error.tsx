'use client';

import ErroPage from '@/app/(full-page)/(auth)/erro/page';

export default function GlobalError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  // opcional: logar p/ observabilidade
  console.error(error);

  return (
    <html>
      <body>
        <ErroPage />
      </body>
    </html>
  );
}
