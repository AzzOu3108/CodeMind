import AuthCard from '@/app/components/cards/AuthCard'
import React from 'react'
import SignupForm from './SignupForm'

export default function page() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <AuthCard title='Sign up' inline>
        <SignupForm />
      </AuthCard>
    </div>
  )
}
