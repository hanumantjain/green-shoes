import React, { useEffect, useState } from 'react';
import img from '../assets/shoes.jpg';
import { useParams } from 'react-router-dom';
import { Navbar } from '../UserComponents/Navbar';
import axios from 'axios';
import { useAppDispatch } from '../hooks';
import { addItem } from '../Features/cart/CartSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SizeObj {
  size_label: string;
  stock_quantity: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    color: string;
    image_urls: string[];
    description: string;
    environmental_message?: string;
    sizes: SizeObj[];
    discount_type?: string;
    discount_value?: number;
    discount_start?: string;
    discount_end?: string;
    discountedPrice?:string
  } | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>(img);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const isDiscounted = Number(product?.discountedPrice) < Number(product?.price);
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;
  const userId = useSelector((state: RootState) => state.user.userId);

  const handleGuestCart = (productId: string, size: number, productData: any) => {
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    
    
    const existingItem = guestCart.find((item: any) => item.productId === productId && item.size === size);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      guestCart.push({
        productId,
        size,
        name: productData.name,
        image: productData.image_urls[0],
        price: productData.discountedPrice || productData.price,
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
          setSelectedImage(response.data.image_urls[0] || img);
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
  
    // Ensure priceToSend is always a valid number
    const priceToSend = product?.discountedPrice ? parseFloat(product.discountedPrice) : product?.price;
  
    if (priceToSend === undefined) {
      setError('Price information is missing.');
      return;
    }
  
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
        price: priceToSend, // Send the priceToSend, which is now guaranteed to be a valid number
      });
  
      if (cartResponse.status === 200) {
        setSuccess('Product successfully added to your cart!');
        setError(null);
  
        dispatch(addItem({
          product_id: id,
          id: id,
          name: product!.name,
          image: product!.image_urls[0],
          size: selectedSize,
          price: priceToSend,
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
  
  const handleSize = (size: string) => {
    setSelectedSize(parseInt(size));
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

        <div className="pl-20 flex flex-col gap-3 w-1/2">
  <div>
    <h2 className="text-4xl font-bold">{product.name}</h2>
    <p>
  {isDiscounted ? (
    <>
      <span className="line-through text-gray-500">${product.price}</span>
      <span className="ml-4 text-xl font-semibold text-green-600">${product.discountedPrice}</span>
    </>
  ) : (
    <span>${product.price}</span> // Only show the price without striking if no discount
  )}
</p>
    <p>{product.color}</p>
  <div className={`flex gap-8 ${error ? 'border border-red-500 p-2' : ''}`}>
    {/* First Row: Sizes 0 to 2 */}
    <div className="flex flex-wrap gap-5">
      {product.sizes
        .sort((a, b) => parseInt(a.size_label) - parseInt(b.size_label)) // Sort sizes in ascending order
        .slice(0, 3) // Get first three sizes
        .map((sizeObj) => (
          <div key={sizeObj.size_label} className="flex flex-col items-center">
            <div
              className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === parseInt(sizeObj.size_label) ? 'bg-gray-200' : ''} ${sizeObj.stock_quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : ''}`}
              onClick={() => sizeObj.stock_quantity > 0 && handleSize(sizeObj.size_label)}
            >
              W {sizeObj.size_label}
            </div>
            <div className="text-xs text-orange-500 mt-1">
              {sizeObj.stock_quantity === 0
                ? 'Out of stock'
                : sizeObj.stock_quantity <= 5
                ? `${sizeObj.stock_quantity} left`
                : ''}
            </div>
          </div>
        ))}
    </div>

    {/* Second Row: Sizes 3 to 5 */}
    <div className="flex flex-wrap gap-5">
      {product.sizes
        .sort((a, b) => parseInt(a.size_label) - parseInt(b.size_label)) // Sort sizes in ascending order
        .slice(3, 6) // Get sizes from index 3 to 5
        .map((sizeObj) => (
          <div key={sizeObj.size_label} className="flex flex-col items-center">
            <div
              className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === parseInt(sizeObj.size_label) ? 'bg-gray-200' : ''} ${sizeObj.stock_quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : ''}`}
              onClick={() => sizeObj.stock_quantity > 0 && handleSize(sizeObj.size_label)}
            >
              W {sizeObj.size_label}
            </div>
            <div className="text-xs text-orange-500 mt-1">
              {sizeObj.stock_quantity === 0
                ? 'Out of stock'
                : sizeObj.stock_quantity <= 5
                ? `${sizeObj.stock_quantity} left`
                : ''}
            </div>
          </div>
        ))}
    </div>

    {/* Third Row: Sizes 6 and beyond */}
    <div className="flex flex-wrap gap-5">
      {product.sizes
        .sort((a, b) => parseInt(a.size_label) - parseInt(b.size_label)) // Sort sizes in ascending order
        .slice(6) // Get sizes starting from index 6
        .map((sizeObj) => (
          <div key={sizeObj.size_label} className="flex flex-col items-center">
            <div
              className={`border border-black p-1.5 px-10 cursor-pointer ${selectedSize === parseInt(sizeObj.size_label) ? 'bg-gray-200' : ''} ${sizeObj.stock_quantity === 0 ? 'bg-gray-300 cursor-not-allowed' : ''}`}
              onClick={() => sizeObj.stock_quantity > 0 && handleSize(sizeObj.size_label)}
            >
              W {sizeObj.size_label}
            </div>
            <div className="text-xs text-orange-500 mt-1">
              {sizeObj.stock_quantity === 0
                ? 'Out of stock'
                : sizeObj.stock_quantity <= 5
                ? `${sizeObj.stock_quantity} left`
                : ''}
            </div>
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
