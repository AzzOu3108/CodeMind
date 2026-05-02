import React from 'react'
import CreateCourseForm from './components/createCourseForm'

export default function page() {
  return (
    <div className='w-full max-w-2xl mx-auto flex flex-col'>
      <div className='pb-7'>
        <h1 className='font-bold text-3xl'>Create New Course</h1>
        <p className='text-gray-600'>Fill in the details below and let AI generate a personalized course for you.</p>
      </div>
      <div className='space-y-9'>
        <CreateCourseForm />
      </div>
    </div>
  )
}
