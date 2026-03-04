import { NextRequest, NextResponse } from 'next/server'

/**
 * STUB: Instagram OAuth
 *
 * To activate real Instagram OAuth:
 * 1. Create a Meta App at developers.facebook.com
 * 2. Add Instagram Basic Display API product
 * 3. Set INSTAGRAM_CLIENT_ID and INSTAGRAM_CLIENT_SECRET in .env.local
 * 4. Replace the redirect below with real OAuth initiation
 *
 * See README.md for full setup guide.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/auth/instagram/callback`

  if (!clientId) {
    // Stub mode: redirect to Instagram profile
    return NextResponse.redirect('https://www.instagram.com/tonhosuplementos')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'user_profile,user_media',
    response_type: 'code',
  })

  return NextResponse.redirect(`https://api.instagram.com/oauth/authorize?${params}`)
}
