import { NextRequest, NextResponse } from 'next/server';
import xiorInstance from '@/app/api/xior-instance';

export async function GET(req: NextRequest) {
    const search = req.nextUrl.search;

    try {
        const res = await xiorInstance.get(`/weather/export${search}`, {
            responseType: 'arraybuffer'
        });

        return new NextResponse(res.data, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="consolidados.xlsx"',
            },
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.error || 'Erro ao exportar Excel.' }, { status: e.status || 500 });
    }
}
