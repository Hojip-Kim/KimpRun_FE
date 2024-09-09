'use client';
import React, { useEffect, useState } from 'react';

const Search = (tokenList) => {
  const [word, setWord] = useState('');

  const searchToken = (searchTerm) => {
    Object.entries(tokenList['tokenList']).forEach((idx) => {
      // console.log(idx[1]);
    });
  };

  useEffect(() => {
    searchToken('hello');
  }, [tokenList]);

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="여기에 원하는 코인 이름을 넣으세요."
        ></input>
      </div>
    </div>
  );
};

export default Search;
