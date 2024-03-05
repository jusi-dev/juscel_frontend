import React from 'react'

import DeployForm from '../DeployForm/DeployForm.component'

const Home = () => {
  return (
    <>
        <div className='flex flex-col items-center justify-centerq<'>
            <div className='h-[100vh] w-full'>
                <DeployForm />
            </div>
        </div>
    </>
  )
}

export default Home