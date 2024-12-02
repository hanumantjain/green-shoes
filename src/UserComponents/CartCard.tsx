import React from 'react'

interface CartCardProps {
  id: string
  title: string
  image: string
  size: number
  price: number
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

const CartCard: React.FC<CartCardProps> = ({
  id,
  title,
  image,
  size,
  price,
  quantity,
  onAdd,
  onRemove,
}) => {
  return (
    <div className="bg-white flex border p-4 my-4">
      <div className="w-1/4">
        <img src={image} alt={title} className="object-cover p-2 rounded-xl" />
      </div>
      <div className="w-2/4">
        <div>
          <p className="font-semibold">{title}</p>
          <p>Size: {size}</p>
          <p>Price: ${price}</p>
        </div>
      </div>
      <div className="w-1/4 flex justify-center items-center">
        <div className="border border-black flex gap-4 px-3 py-0.5 rounded-full">
          <div className="cursor-pointer" onClick={onRemove}>
            -
          </div>
          <div>{quantity}</div>
          <div className="cursor-pointer" onClick={onAdd}>
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
