import React, { useEffect, useState } from 'react'
import ShoeCard from '../UserComponents/ShoeCard'
import img from '../assets/shoes.jpg'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../UserComponents/Navbar'
import axios from 'axios'

interface Size {
  size_label: string
  stock_quantity: number
}

interface Product {
  product_id: number
  name: string
  description: string
  price: number
  image_url: string
  category_name: string
  sizes: Size[]
}

const Products:React.FC = () => {
    const[products, setProducts] = useState<Product[]>([])
    const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL
    const navigate = useNavigate()

    const handleShoeCardClick = (id: number) => {
        navigate(`/products/${id}`)
    }

    useEffect(() => {
      const fetchProducts = async () => {
        try{
          const response = await axios.get(`${backendBaseUrl}/getProducts`)
          if (response.status === 200){
            setProducts(response.data)
          }else {
            throw new Error('Error')
          }
        } catch (error){
          alert(error)
        }
      }
      fetchProducts()
    }, [backendBaseUrl])
  return (
    <div>
      <Navbar />
      {/* <h1 className="text-3xl font-bold text-center mt-8 mb-6">All Products</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-20 py-10">
        {products.map((product) => (
            <div key={product.product_id} onClick={() => handleShoeCardClick(product.product_id)}>
                <ShoeCard 
                  image={img} 
                  title={product.name} 
                  description={product.description} 
                  price={product.price} />
            </div>
        ))}
      </div>
    </div>
  )
}

export default Products