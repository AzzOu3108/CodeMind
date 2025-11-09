import React, { ReactNode } from 'react'
import BlurBackground from '../components/ui/BlurBackground';

interface AuthlayoutProps {
    children: ReactNode,
}

const AuthLayout = ({children}: AuthlayoutProps) =>{
    return(
        <section className='relative w-full h-screen flex justify-center items-center overflow-hidden'>
            <BlurBackground className='translate-y-28'/>
            {children}
        </section>
    )
}

export default AuthLayout;