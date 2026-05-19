import { NextRequest, NextResponse } from 'next/server';
import xiorInstance from '@/app/api/xior-instance';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;

    try {
        const res = await xiorInstance.get(`/weather/extremes${search}`);
        return NextResponse.json(res.data);
    } catch (e: any) {
        return NextResponse.json({ error: e.error || 'Erro ao buscar extremos meteorológicos.' }, { status: e.status || 500 });
    }
}
