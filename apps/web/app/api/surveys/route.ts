import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';

// TODO(MVP-2): list surveys (GET) and create draft surveys (POST).
//   GET  -> filter by state=open, return paginated list with reward + stake.
//   POST -> validate body with zod schema, hash content, persist as draft.
//           Actual on-chain creation happens client-side (creator signs the tx);
//           backend just persists the off-chain content.

export async function GET(_req: NextRequest) {
  return NextResponse.json({ surveys: [] });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'TODO(MVP-2)' }, { status: 501 });
}
