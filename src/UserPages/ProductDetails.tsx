import React, { useEffect, useState } from 'react'
import img from '../assets/shoes.jpg'
import { useParams } from 'react-router-dom'
import { Navbar } from '../UserComponents/Navbar'
import axios from 'axios'
import { useAppDispatch } from '../hooks'
import { addItem } from '../Features/cart/CartSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>(img)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const userId = useSelector((state: RootState) => state.user.userId)

  // Function to handle cart for guest users using localStorage
  const handleGuestCart = (productId: string, size: number, productData: any) => {
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    
    const existingItem = guestCart.find((item: any) => item.productId === productId && item.size === size);
    
    if (existingItem) {
      // If item already exists, increase quantity
      existingItem.quantity += 1;
    } else {
      // If item does not exist, add to the cart
      guestCart.push({
        productId,
        size,
        name: productData.name,
        image: productData.image_urls[0],
        price: productData.price,
        quantity: 1
      });
    }

    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    setSuccess('Product added to your cart!');
    setError(null);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/getProducts/${id}`);
        if (response.status === 200) {
          setProduct(response.data);
          setSelectedImage(response.data.image_urls[0] || img)
        } else {
          throw new Error('Product not found');
        }
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchProduct();
  }, [id, backendBaseUrl]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size before adding to the cart.');
      setSuccess(null);
      return;
    }
  
    if (!id) {
      setError('Product ID is missing');
      setSuccess(null);
      return;
    }

    // Check if the user is a guest
    if (userId === 'guest') {
      handleGuestCart(id, selectedSize, product);
      return;
    }

    try {
      const cartResponse = await axios.post(`${backendBaseUrl}/addToCart`, {
        user_id: userId,
        productId: id,
        size: selectedSize,
        quantity: 1,
      });
  
      if (cartResponse.status === 200) {
        setSuccess('Product successfully added to your cart!');
        setError(null);

        dispatch(addItem({
          product_id: id,
          id: id,
          name: product.name,
          image: product.image_urls[0],
          size: selectedSize,
          price: product.price,
          quantity: 1,
        }));
      } else {
        throw new Error('Failed to add product to cart.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setSuccess(null);
    }
  };
  
  const handleSize = (size: number) => {
    setSelectedSize(size);
    setError(null); 
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex px-32 w-full pt-20">
        <div className="w-1/2">
          <img
            src={selectedImage}
            alt={product?.name || 'Product'}
            className="w-full object-cover"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <div className="flex gap-4 mt-4">
            {product.image_urls?.map((imageUrl: string, index: number) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer border ${
                  selectedImage === imageUrl ? 'border-black' : 'border-gray-300'
                }`}
                onClick={() => handleImageClick(imageUrl)}
              />
            )) || <div>No images available</div>}
          </div>
        </div>

        <div className="pl-20 flex flex-col gap-3">
          <div>
            <h2 className="text-4xl font-bold">{product.name}</h2>
            <p>$ {product.price}</p>
            <p>{product.color}</p>
          </div>

          <div>
            <h1>Size</h1>
            <div className={`flex gap-12 ${error ? 'border border-red-500 p-2' : ''}`}>
              <div className="flex flex-col gap-5">
                {[6, 7, 8].map((size) => (
                  <div
                    key={size}
                    className={`border border-black p-1.5 px-10 cursor-pointer ${
                      selectedSize === size ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleSize(size)}
                  >
                    W {size}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-5">
                {[9, 10, 11].map((size) => (
                  <div
                    key={size}
                    className={`border border-black p-1.5 px-10 cursor-pointer ${
                      selectedSize === size ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleSize(size)}
                  >
                    W {size}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-5">
                {[12, 13, 14].map((size) => (
                  <div
                    key={size}
                    className={`border border-black p-1.5 px-10 cursor-pointer ${
                      selectedSize === size ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleSize(size)}
                  >
                    W {size}
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          
          <div>
            <p>{product.description}</p>
            {product.environmental_message && (
              <div className="mt-4 p-4 border-t border-gray-200">
                <h3 className="font-semibold text-green-600">Environmental Impact</h3>
                <p className="text-sm text-gray-700">{product.environmental_message}</p>
              </div>
            )}
          </div>

          {success && <p className="text-green-500 mt-2">{success}</p>}

          <button
            className="border border-black p-3 rounded-full"
            onClick={handleAddToCart}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
