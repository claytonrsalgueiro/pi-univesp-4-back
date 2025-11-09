import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1) Leia o FormData vindo do browser
    const formData = await req.formData();

    // 2) Monte o Authorization Basic (pro backend Spring)
    const username = process.env.BASIC_USER || 'admin';
    const password = process.env.BASIC_PASS || '123456';
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    // 3) Monte a URL do backend (API_URL deve terminar com /api)
    const base = (process.env.API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
    const url = `${base}/weather/upload`;

    // 4) Reencaminhe via fetch nativo – NÃO SETE Content-Type (o runtime adiciona o boundary)
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader
        // NÃO coloque 'Content-Type' aqui!
      },
      body: formData
    });

    // 5) Propague a resposta
    const text = await upstream.text();
    const ct = upstream.headers.get('content-type') || 'application/json';

    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': ct }
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Erro ao fazer upload.' },
      { status: 500 }
    );
  }
}
