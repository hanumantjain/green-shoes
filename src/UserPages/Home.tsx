import React from 'react'
import { Navbar } from '../UserComponents/Navbar'

export const Home = () => {
  return (
    <div>
        <div className='h-screen bg-[#E1C8A9] flex flex-col '>
            <Navbar />
            <div className='w-1/2 h-auto flex flex-col gap-10 pt-20 pl-[124px] flex-grow text-white relative'>
            <div className='w-[400px] h-[240px] bg-[#D2B183]'></div>
                <div>
                    <h1 className='text-[20px] font-small'>NEW  COLLECTION  FOR  SNEAKERS</h1>
                </div>
                <div>
                    <h1 className='text-[70px] font-medium'>
                    Sneakers And
                    Athletic Shoes</h1>
                </div>
                <div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat quod at mollitia, ipsa deleniti libero eius, ut, autem modi quis saepe? Corrupti, vel quos veritatis consectetur ducimus totam. Ipsa, esse!</p>
                </div>
                <div>
                    <button className='bg-white text-black p-[11px]'>Shop Now</button>
                </div>
            </div>

        </div>
    </div>
  )
}
