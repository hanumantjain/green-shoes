import React from 'react'
import { Navbar } from '../UserComponents/Navbar'
import homeShoe from '../assets/home-shoe.png'
import { Link } from 'react-router-dom'


export const Home:React.FC = () => {
  return (
        <div className='flex flex-col '>
            <Navbar />
            <div className='flex w-full'>
                <div className='pl-28 w-1/2 pt-20 flex flex-col gap-8 text-[#333333] justify-center'>
                    <p>Stride & Shine with PRAK</p>
                    <div>
                        <h1 className='text-xl font-small'>NEW  COLLECTION  FOR  SNEAKERS</h1>
                    </div>
                    <div>
                        <h1 className='text-6xl font-medium'>
                        Sneakers And
                        Heels Collection</h1>
                    </div>
                    <div className=''>
                        <p>Step into confidence with our latest collection designed exclusively for women. Whether you're chasing dreams or conquering the streets, our sneakers and heels bring together style, comfort, and elegance.</p>
                    </div>
                    <div>
                        <Link to='/products' className='bg-white text-black p-3 px-8' >Shop Now</Link>
                    </div>
                </div>
                <div className='relative'>
                    <div className='absolute w-96 h-full border-4 border-[#D2B183] top-32 left-36 z-10 '></div>
                    <div className='w-96 h-full bg-[#e9c189] absolute top-20 left-52 z-20'>
                        <div className='w-64 h-full absolute -top-4 left-64 flex items-center justify-center'>
                            <h1 className='text-[164px] -rotate-90 font-medium whitespace-nowrap gradient-text tracking-[0.2em]'>PRAK</h1>
                        </div>
                    </div>
                </div>
                <div className='absolute z-30 w-3/5 right-36 top-28'>
                    <img src={homeShoe} alt='shoe' className='object-cover'/>
                </div>
            </div>
            <div className='mt-96'>
                
            </div>
        </div>
  )
}
