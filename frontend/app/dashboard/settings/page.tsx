import React from 'react'
import AccountDetails from './components/AccountDetails'
import DangerZone from './components/DangerZone'

export default function page() {
  return (
    <div className='px-36'>
      <div className='pb-6'>
        <h1 className='font-bold text-3xl'>Settings</h1>
        <p className='text-gray-600'>Manage your account settings and preferences.</p>
      </div>
      <div className='space-y-9'>
        <AccountDetails />
          <DangerZone />
        </div>
      </div>
  )
}
