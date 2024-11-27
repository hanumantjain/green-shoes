import React, { useEffect, useState } from 'react';
import img from '../assets/shoes.jpg'; // Default image in case no image is found
import { useParams } from 'react-router-dom';
import { Navbar } from '../UserComponents/Navbar';
import axios from 'axios';
import { useAppDispatch } from '../hooks';
import { addItem } from '../Features/cart/CartSlice'; // Import addItem action

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null); // Product data state
  const [selectedSize, setSelectedSize] = useState<number | null>(null); // Selected size state
  const [selectedImage, setSelectedImage] = useState<string>(img); // For image selection
  const [error, setError] = useState<string | null>(null); // For error message
  const [success, setSuccess] = useState<string | null>(null); // For success messages
  const dispatch = useAppDispatch(); // For dispatching actions

  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/getProducts/${id}`);
        if (response.status === 200) {
          setProduct(response.data);
          setSelectedImage(response.data.image_urls[0] || img); // Default to first image if available
        } else {
          throw new Error('Product not found');
        }
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchProduct();
  }, [id, backendBaseUrl]);

  // Handle adding product to the cart
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
  
    const userId = '3'; // Hardcoded user ID
  
    try {
      const cartResponse = await axios.post(`${backendBaseUrl}/addToCart`, {
        userId,
        productId: id,
        size: selectedSize,
        quantity: 1,
      });
  
      if (cartResponse.status === 200) {
        setSuccess('Product successfully added to your cart!');
        setError(null);
  
        // Dispatch to add item to Redux cart state
        dispatch(addItem({
          id: id,
          name: product.name,
          image: product.image_urls[0], // Use the first image
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
  
  

  // Handle size selection
  const handleSize = (size: number) => {
    setSelectedSize(size);
    setError(null); // Clear any error when size is selected
  };

  // Handle image thumbnail click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // If product is not found or is still loading
  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex px-32 w-full pt-20">
        {/* Product Images Section */}
        <div className="w-1/2">
          {/* Main Image */}
          <img
            src={selectedImage}
            alt={product?.name || 'Product'}
            className="w-full object-cover"
            style={{ maxHeight: '400px', objectFit: 'cover' }} // Adjust height and fit for the main image
          />
          {/* Thumbnail Images */}
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

        {/* Product Details Section */}
        <div className="pl-20 flex flex-col gap-3">
          <div>
            <h2 className="text-4xl font-bold">{product.name}</h2>
            <p>$ {product.price}</p>
            <p>{product.color}</p>
          </div>

          {/* Size Selection */}
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

          {/* Product Description */}
          <div>
            <p>{product.description}</p>
            {product.environmental_message && (
              <div className="mt-4 p-4 border-t border-gray-200">
                <h3 className="font-semibold text-green-600">Environmental Impact</h3>
                <p className="text-sm text-gray-700">{product.environmental_message}</p>
              </div>
            )}
          </div>

          {/* Success Message */}
          {success && <p className="text-green-500 mt-2">{success}</p>}

          {/* Add to Cart Button */}
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
