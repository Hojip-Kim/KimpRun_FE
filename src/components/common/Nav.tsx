'use client';

import serverFetch from '@/server/fetch/server';
import React, { useEffect, useState } from 'react';
import './Nav.css';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [userCount, setUserCount] = useState(0);

  const reduxTether = useSelector((state: RootState) => state.info.tether);

  // TODO : refactoring - server side, client side hooks 나누기.

  // const GetTether = async (): Promise<string | undefined> => {
  //   const URL = process.env.NEXT_PUBLIC_TETHER_URL;

  //   const requestInit: RequestInit = {
  //     method: 'GET',
  //     headers: { 'Content-type': 'application/json' },
  //   };

  //   try {
  //     const response = await serverFetch(URL, requestInit);

  //     if (response.ok) {
  //       return await response.text;
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    // GetTether().then((res) => setDollars(res[0].basePrice));
    // setTether(reduxTether)

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
              테더 : {reduxTether}{' '}
            </div>
            <div className="user-count">유저 수 : {userCount}</div>
          </div>
        </section>
        <section className="nav-container2">
          <div className="nav-category-2">
            <button
              onClick={() => {
                window.location.href = 'http://localhost:3000/';
              }}
              className="title"
            >
              KIMP-RUN
            </button>
          </div>
        </section>
        {/* <div className="nav-container2"></div> */}
      </div>
    </nav>
  );
};

export default Nav;
