import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='max-w-3xl mx-auto py-10 px-4'>
        <h1 className='text-3xl font-bold pb-10'>Blog</h1>
        {children}
    </main>
  )
}

export default layout