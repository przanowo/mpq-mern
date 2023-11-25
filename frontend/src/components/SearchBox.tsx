import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams<{ keyword: string }>();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <div className='border-2 border-gray-300 rounded-xl'>
      <form className='flex' onSubmit={submitHandler}>
        <input
          type='text'
          placeholder='Search Products...'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          className='p-2 rounded-l-md bg-transparent '
        />
        <button type='submit' className='px-2 hover:bg-white/25'>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
