import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieOptions = Record<string, any>

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // No middleware, escreva no response
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Protege /ofertas e /cupons
  if ((path.startsWith('/ofertas') || path.startsWith('/cupons')) && !session) {
    return NextResponse.redirect(new URL('/?login=required', request.url))
  }

  // Protege /admin
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) ?? []

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email ?? '')
      .single()

    const isAdmin = !!adminUser || adminEmails.includes(session.user.email ?? '')

    if (!isAdmin && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/ofertas/:path*', '/cupons/:path*'],
}
