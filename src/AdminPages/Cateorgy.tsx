import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navbar } from '../AdminComponents/Navbar'

interface CategoryProps {
    onLogOut: () => void
}

const Cateorgy:React.FC<CategoryProps> = ({ onLogOut }) => {
    const [categories, setCategories] = useState<any[]>([])
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/getCategory`)
                const categoryNames = response.data.map((category: { category_name: string }) => category.category_name)
                setCategories(categoryNames)
            } catch (error) {
                console.log('Error fetching categories', error)
            }
        }
        fetchCategories()
    }, [backendBaseUrl])

  return (
    <div>
        <Navbar onLogOut={onLogOut}/>
            <div className="flex flex-wrap gap-6 justify-between p-20">
                {categories.map((categoryName, index) => (
                    <div
                        key={index}
                        className="w-1/6 p-4 border border-gray-200 rounded-lg bg-gray-100 shadow-md text-center"
                    >
                        {categoryName}
                    </div>
                ))}
            </div>
    </div>
  )
}

export default Cateorgy