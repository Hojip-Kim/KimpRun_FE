import { NextResponse } from 'next/server';
import { register, collectDefaultMetrics } from 'prom-client';

if (typeof window === 'undefined') {
  collectDefaultMetrics();
}

export async function GET() {
  const metrics = await register.metrics();

  return new NextResponse(metrics, {
    headers: {
      'Content-Type': register.contentType,
    },
  });
}
