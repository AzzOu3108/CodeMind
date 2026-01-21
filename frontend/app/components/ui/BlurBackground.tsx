import React from 'react'

interface BlurProps {
  width?: number | string
  height?: number | string
  className?: string
}

export default function BlurBackground({ 
  width = 1500, 
  height = 800,
  className = '' 
}: BlurProps) {
  const widthValue = typeof width === 'number' ? `${width}px` : width
  const heightValue = typeof height ==='number' ? `${height}px` : height

  return (
    <div className="absolute -top-30 inset-0 -z-30 flex justify-center">
      <div
        className={`rounded-full blur-[120px] opacity-80 
         bg-radial from-[rgba(155,93,229,0.4)] via-[rgba(201,168,241,0.5)] to-[rgba(255,255,255,1)] ${className}`}
        style={{
          width: widthValue,
          height: heightValue
        }}
      />
    </div>
  )
}
