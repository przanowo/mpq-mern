// ImageViewerModal.tsx
import React, { useState } from 'react'

interface ImageViewerModalProps {
  isOpen: boolean
  images: string[]
  onClose: () => void
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  images,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen) {
    return null
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    )
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50'>
      <div className='relative'>
        <img
          src={images[currentIndex]}
          alt='Product'
          className='lg:w-auto lg:h-[90vh] lg:max-w-full'
        />
        <button
          onClick={onClose}
          className='absolute top-0 right-0 m-4 text-white text-4xl p-4'
        >
          &times;
        </button>
        <button
          onClick={handlePrev}
          className='absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-4xl p-4'
        >
          &#10094;
        </button>
        <button
          onClick={handleNext}
          className='absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-4xl p-4'
        >
          &#10095;
        </button>
      </div>
    </div>
  )
}

export default ImageViewerModal
