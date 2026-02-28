import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login') || 
                     request.nextUrl.pathname.startsWith('/auth/signup') 

  if(isDashboard && !accessToken && !refreshToken){
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if(isDashboard && !accessToken && refreshToken){
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Cookie': `refresh_token=${refreshToken}`
            },
        })

        console.log('Refresh response status:', response.status)

        if(response.ok){
            const data = await response.json()

            const nextResponse = NextResponse.redirect(request.url)
            nextResponse.cookies.set('access_token', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60,
            })

            return nextResponse
        } else {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  if(isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url)) 
  }

  return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/login', '/auth/signup'],
}