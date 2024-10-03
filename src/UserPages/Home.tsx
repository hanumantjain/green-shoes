import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import img from '../assets/shoe.svg'

export const Home:React.FC = () => {
  return (
    <div>
        <div className='h-screen bg-[#E1C8A9] flex flex-col '>
            <Navbar />
            <div className='flex flex-col justify-center items-center md:flex-row lg:gap-20'>
                <div className=' w-full p-10 lg:w-1/2 flex flex-col gap-8 lg:pl-28 text-white justify-center'>
                        <div>
                            <h1 className='text-xl font-small'>NEW  COLLECTION  FOR  SNEAKERS</h1>
                        </div>
                        <div>
                            <h1 className='text-6xl lg:text-7xl font-medium'>
                            Sneakers And
                            Athletic Shoes</h1>
                        </div>
                        <div className='2xl:pr-20'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat quod at mollitia, ipsa deleniti libero eius, ut, autem modi quis saepe? Corrupti, vel quos veritatis consectetur ducimus totam. Ipsa, esse!</p>
                        </div>
                        <div>
                            <button className='bg-white text-black p-3 px-8'>Shop Now</button>
                        </div>
                </div>
                
                <div className='relative'>
                    <div className='w-80 h-3/4 border-4 border-[#D2B183] absolute top-32 left-16 z-10'>
                    </div>
                    <div className='w-96 h-3/4 bg-[#D2B183] absolute top-24 left-32 z-20'>
                        <div className='w-64 h-3/4 absolute top-12 left-64 flex items-center justify-center'>
                            <h1 className='text-[174px] -rotate-90 font-semibold whitespace-nowrap gradient-text'>PUMA</h1>
                        </div>
                    </div>
                    <div className='relative h-full z-30 top-4 right-28 2xl:right-48 2xl:-rotate-6 2xl:-top-4'>
                        <img src={img} alt='shoe' className='w-full h-full object-none'/>
                    </div>
                </div>
                    
            </div>
        </div>
    </div>
  )
}
