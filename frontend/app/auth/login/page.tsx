import AuthCard from '@/app/components/cards/AuthCard'
import React from 'react'
import LoginForm from './LoginForm'

export default function page() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
          <AuthCard title='Welcome back'>
            <LoginForm />
          </AuthCard>
        </div>
  )
}
