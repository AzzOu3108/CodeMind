import React from 'react'
import AccountDetails from './components/AccountDetails'
import DangerZone from './components/DangerZone'


// md:px-26 lg:px-36
export default function page() {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex flex-col'>
        <div className='pb-7'>
        <h1 className='font-bold text-3xl'>Settings</h1>
        <p className='text-gray-600'>Manage your account settings and preferences.</p>
        </div>
        <div className='space-y-9'>
          <AccountDetails />
          <DangerZone />
        </div>
      </div>
    </div>
  )
}
