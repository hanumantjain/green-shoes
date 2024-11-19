import React, { useEffect, useState } from 'react'
import ShoeCard from '../UserComponents/ShoeCard'
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
  image_url: string // This is the first image from the image_urls array
  color: string
  category_name: string
  sizes: Size[]
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL
  const navigate = useNavigate()

  // Handle click on shoe card to go to the product detail page
  const handleShoeCardClick = (id: number) => {
    navigate(`/products/${id}`)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the backend API
        const response = await axios.get(`${backendBaseUrl}/getProducts`)
        if (response.status === 200) {
          setProducts(response.data) // Set fetched products to state
        } else {
          throw new Error('Error fetching products')
        }
      } catch (error) {
        console.error(error)
        alert('Error fetching products')
      }
    }

    fetchProducts()
  }, [backendBaseUrl])

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-20 py-10">
        {products.map((product) => (
          <div key={product.product_id} onClick={() => handleShoeCardClick(product.product_id)}>
            <ShoeCard 
              image={product.image_url} 
              title={product.name} 
              description={product.description} 
              color={product.color}
              price={product.price} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
