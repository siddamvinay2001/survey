import 'server-only';
import { type NextRequest, NextResponse } from 'next/server';

// TODO(MVP-2): Sign-In With Solana flow.
// POST /api/auth/siws/challenge -> { nonce } (also sets http-only cookie with nonce)
// POST /api/auth/siws          -> { wallet, signature } verify -> JWT cookie
//
// Use jose for HS256 JWT. Verify the signature with tweetnacl. Bind the JWT to
// the wallet pubkey and set a 7-day expiry; rotate the nonce per session.

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'TODO(MVP-2)' }, { status: 501 });
}
