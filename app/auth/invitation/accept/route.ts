import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { DEFAULT_URL } from '@/app/utils/config'

export async function GET(request: Request) {
  console.log("🚀 ~ /auth/invitation/accept ~ GET:")
  const { searchParams, origin } = new URL(request.url)
  console.log("🚀 ~ GET ~ origin:", origin)
  
  console.log("🚀 ~ GET ~ searchParams:", searchParams)
  
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {

      const url = `${DEFAULT_URL}${next}`;
      console.log('url:', url);
      return NextResponse.redirect(url)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}