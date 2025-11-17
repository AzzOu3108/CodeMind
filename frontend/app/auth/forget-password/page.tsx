import React from 'react'
import PasswordCard from '@/app/components/cards/PasswordCard'
import ForgetPassForm from './ForgetPassForm'

export default function page() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <PasswordCard
       title='Forgot password?'
       text= {`No worries, we'll send you rest instructions.`}
       variant='default'
       >
        <ForgetPassForm/>
      </PasswordCard>
    </div>
  )
}
