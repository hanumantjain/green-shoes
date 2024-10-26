import React from 'react'


const FirstPage = () => {
  const handleAddItems = () => {
    alert('Add')
  }
  const handleRemoveItems = () => {
    alert('Remove')
  }
  const handleUpdateItems = () => {
    alert('Update')
  }
  const handleDeleteItems = () => {
    alert('Delete')
  }
  return (
    <div>
      <div className='flex gap-8'>
        <div className='border border-black p-3 w-28 text-center cursor-pointer' onClick={handleAddItems}>
          Add
        </div>
        <div className='border border-black p-3 w-28 text-center cursor-pointer' onClick={handleRemoveItems}>
          Remove
        </div>
        <div className='border border-black p-3 w-28 text-center cursor-pointer' onClick={handleUpdateItems}>
          Update
        </div>
        <div className='border border-black p-3 w-28 text-center cursor-pointer' onClick={handleDeleteItems}>
          Delete
        </div>
        
      </div>
    </div>
  )
}

export default FirstPage