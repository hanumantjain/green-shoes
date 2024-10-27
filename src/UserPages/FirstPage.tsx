import React, { useEffect } from 'react'
import landingImgae from '../assets/landingImage.png'
import icon from '../assets/icon.png'
import { useNavigate } from 'react-router-dom'

const FirstPage:React.FC = () => {
  const navigate = useNavigate()

  useEffect( ()=> {
    const timer = setTimeout(()=> {
      navigate('/userSignIn')
    },5000)
    return () => clearTimeout(timer)
  }, [navigate])
  
  return (
    <div className='h-screen px-20'>
      <div className='flex justify-center items-center pb-10 p-5'>
        <img src={icon} alt="icon" className='w-28' />
        <h1 className='text-4xl font-bold'>PARK</h1>
      </div>
      <div className='flex p-20 items-center w-full bg-[#c5e7e8] rounded-3xl'>
        <div className='text-4xl w-1/2 pr-20 text-[#4F6149] font-semibold'>
          <p>At PRAK, we are committed to stepping lightly on the planet by using sustainable materials and Eco-friendly practices,
             creating footwear that not only feels good but does good for the environment.</p>
        </div>
        <div className='w-1/2'>
          <img src={landingImgae} alt="landing-page-shoe" />
        </div>
      </div>
    </div>
  )
}

export default FirstPage