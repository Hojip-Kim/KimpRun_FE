'use client';

import serverFetch from '@/server/fetch/server';
import React, { useEffect, useState } from 'react';
import './Nav.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [userCount, setUserCount] = useState(0);

  const reduxTether = useSelector((state: RootState) => state.info.tether);

  // TODO : refactoring - server side, client side hooks 나누기.

  useEffect(() => {
    // setUserCount((prevCount) => prevCount + 1);

    return () => {};
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
            <ul>
              <li
                onClick={() => {
                  window.location.href = 'http://localhost:3000/community';
                }}
              >
                커뮤니티
              </li>
              <li
                onClick={() => {
                  window.location.href = 'http://localhost:3000/statistics';
                }}
              >
                통계
              </li>
              <li
                onClick={() => {
                  window.location.href = 'http://localhost:3000/news';
                }}
              >
                뉴스
              </li>
              <li
                onClick={() => {
                  window.location.href = 'http://localhost:3000/profile';
                }}
              >
                내 프로필
              </li>
            </ul>
          </div>
        </section>
        {/* <div className="nav-container2"></div> */}
      </div>
    </nav>
  );
};

export default Nav;
