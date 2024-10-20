'use client';

import React, { useEffect, useState } from 'react';
import './Nav.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Modal from '@/components/modal/modal';
import LoginForm from '@/components/login/loginForm';
import { logout, setUser } from '@/redux/reducer/authReducer';
import { fetchUserInfo } from '@/components/auth/fetchUserInfo';

const Nav = () => {
  const [dollars, setDollars] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 300 });

  const reduxTether = useSelector((state: RootState) => state.info.tether);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_URL;

  const fetchUserInfoData = async () => {
    const data = await fetchUserInfo(statusUrl);
    if (data && data.user) {
      dispatch(setUser(data.user));
    }
  };

  useEffect(() => {
    fetchUserInfoData();
  }, [isAuthenticated, dispatch]);

  const handleLoginClick = () => {
    setModalSize({ width: 400, height: 300 });
    setIsModalActive(true);
  };

  const handleLogout = async () => {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };

    try {
      const response = await fetch(logoutUrl, requestInit);

      if (response.ok) {
        alert('로그아웃 성공');
        dispatch(logout());
      } else {
        alert('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 오류', error);
      alert('로그아웃 중 오류 발생');
    }
  };
  return (
    <nav className="navbar">
      <div className="nav-box">
        <section className="nav-container1">
          <div className="nav-category">
            <div className="category">
              <img src="" />
              환율 : {dollars}
            </div>
            <div className="category">
              <img src="" />
              테더 : {reduxTether}{' '}
            </div>
            <div className="user-count">유저 수 : {userCount}</div>
          </div>
          <div
            className="nav-category"
            onClick={isAuthenticated ? handleLogout : handleLoginClick}
          >
            {isAuthenticated ? '로그아웃' : '로그인'}
          </div>
        </section>
        <section className="nav-container2">
          <div className="nav-category">
            <button
              onClick={() => {
                window.location.href = process.env.NEXT_PUBLIC_MAIN_PAGE;
              }}
              className="title"
            >
              KIMP-RUN
            </button>
            <ul>
              <li
                onClick={() => {
                  window.location.href = process.env.NEXT_PUBLIC_COMMUNITY_PAGE;
                }}
              >
                커뮤니티
              </li>
              <li
                onClick={() => {
                  window.location.href =
                    process.env.NEXT_PUBLIC_STATISTICS_PAGE;
                }}
              >
                통계
              </li>
              <li
                onClick={() => {
                  window.location.href = process.env.NEXT_PUBLIC_NEWS_PAGE;
                }}
              >
                뉴스
              </li>
              <li
                onClick={() => {
                  window.location.href = process.env.NEXT_PUBLIC_PROFILE_PAGE;
                }}
              >
                내 프로필
              </li>
            </ul>
          </div>
        </section>
        {/* <div className="nav-container2"></div> */}
      </div>

      {isModalActive && (
        <Modal
          width={modalSize.width}
          height={modalSize.height}
          element={
            <LoginForm
              closeModal={() => setIsModalActive(false)}
              setModalSize={setModalSize}
            />
          }
          setModal={setIsModalActive}
        ></Modal>
      )}
    </nav>
  );
};
export default Nav;
