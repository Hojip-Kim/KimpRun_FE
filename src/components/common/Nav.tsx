'use client';

import serverFetch from '@/server/fetch/server';
import React, { useEffect, useState } from 'react';
import './Nav.css';

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [tether, setTether] = useState('');
  const [userCount, setUserCount] = useState(0);

  // TODO : refactoring - server side, client side hooks 나누기.

  const GetTether = async (): Promise<string | undefined> => {
    // TODO : URL key 환경변수 설정.
    const URL =
      'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD';
    const requestInit: RequestInit = {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    };

    try {
      const response = await serverFetch(URL, requestInit);
      // console.debug(response);

      if (response.ok) {
        return await response.text;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // console.debug('hello');
    GetTether().then((res) => setDollars(res[0].basePrice));

    setUserCount((prevCount) => prevCount + 1);

    return () => setUserCount((prevCount) => prevCount - 1);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-box">
        <section className="nav-container1">
          <div className="nav-category-1">
            <div className="nav-category">
              <img src="" />
              환율 : {dollars}
            </div>
            <div className="nav-category">
              <img src="" />
              테더 : {tether}{' '}
            </div>
            <div className="user-count">{userCount}</div>
          </div>
        </section>
        <section className="nav-container2">
          <div className="nav-category-2">
            <a href="localhost:3000" className="title">
              KIMP-RUN
            </a>
          </div>
        </section>
        {/* <div className="nav-container2"></div> */}
      </div>
    </nav>
  );
};

export default Nav;
