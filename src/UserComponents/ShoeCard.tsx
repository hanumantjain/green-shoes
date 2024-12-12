import React from 'react';

interface ShoeCardProps {
  image: string;
  title: string;
  description: string;
  color: string;
  price: number | string;
  discountedPrice: number | string;
}

const ShoeCard: React.FC<ShoeCardProps> = ({ image, title, description, color, price, discountedPrice }) => {
  const isDiscounted = Number(discountedPrice) < Number(price);

  return (
    <div className="shoe-card border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img src={image} alt={title} className="w-full h-80 object-cover rounded-lg" />
      <h2 className="text-xl font-bold mt-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="text-gray-800">Color: {color}</p>
      <div className="mt-2">
        {isDiscounted ? (
          <div>
            <span className="text-gray-500 line-through mr-2">
              ${Number(price).toFixed(2)}
            </span>
            <span className="text-green-600 font-bold">
              ${Number(discountedPrice).toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="text-gray-800 font-bold">
            ${Number(price).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ShoeCard;
