import React, { ReactNode } from 'react'
import BlurBackground from '../components/ui/BlurBackground';
import { Toaster } from 'sonner';

interface AuthlayoutProps {
    children: ReactNode,
}

const AuthLayout = ({children}: AuthlayoutProps) =>{
    return(
        <section className='relative w-full h-screen flex justify-center items-center overflow-hidden'>
            <BlurBackground className='translate-y-28'/>
            <Toaster richColors position='top-center' />
            {children}
        </section>
    )
}

export default AuthLayout;