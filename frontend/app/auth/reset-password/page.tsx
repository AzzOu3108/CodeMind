import React from 'react'
import PasswordCard from '@/app/components/cards/PasswordCard'
import ResetPassForm from './ResetPassForm'

export default function page() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
          <PasswordCard
           title='Reset your password?'
           text= {`You're almost done! Just create a new password and confirm it to regain access to your account.`}
           variant='compact'
           >
            <ResetPassForm/>
          </PasswordCard>
        </div>
  )
}
