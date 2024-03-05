import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SearchBox = ({ isAdmin = false }) => {
  const navigate = useNavigate()
  const { keyword: urlKeyword, categoryName } = useParams<{
    keyword: string
    categoryName: string
  }>()
  const [keyword, setKeyword] = useState(urlKeyword || '')

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keyword.trim()) {
      if (isAdmin) {
        navigate(`/admin/productlist/search/${keyword}`)
      } else if (categoryName) {
        // If there's a category, include it in the search path
        navigate(`/category/${categoryName}/search/${keyword}`)
      } else {
        // Standard search without category
        navigate(`/search/${keyword}`)
      }
    } else {
      navigate(`/`)
    }
  }
  const clearSearch = () => {
    setKeyword('')
    if (categoryName) {
      navigate(`/category/${categoryName}`)
    } else {
      navigate(isAdmin ? `/admin/productlist` : `/`)
    }
  }

  return (
    <div className='border-2 mx-8 lg:m-0 border-gray-300 rounded-xl w-full '>
      <form className='flex justify-between' onSubmit={submitHandler}>
        <input
          type='text'
          placeholder='Search Products...'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          className='p-2 rounded-l-md bg-transparent '
        />
        <div className='flex'>
          <button
            type='button'
            onClick={clearSearch}
            className='px-2 hover:bg-white/25'
          >
            x
          </button>
          <button type='submit' className='pr-2 hover:bg-white/25 '>
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBox
