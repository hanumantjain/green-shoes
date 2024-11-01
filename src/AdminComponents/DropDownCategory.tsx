import React, { useState } from 'react'

interface Options {
    value: string
    label: string
}
interface DropDownCategoryProps {
  categories: Options[]
  onChange : (value: string) => void
}

const DropDownCategory:React.FC<DropDownCategoryProps> = ({ categories, onChange }) => {
    const[selectedCategory, setSelectedCategory] = useState<string>('')
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        setSelectedCategory(newValue)
        onChange(newValue)
      }
  return (
    <div>
        <select
            value={selectedCategory}
            onChange={handleChange}
            className='border border-black p-4 rounded-xl w-full'
            >
                <option value="">Select an category</option>
                {categories.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
        ))}
        </select>
    </div>
  )
}

export default DropDownCategory