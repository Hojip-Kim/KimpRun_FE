'use client';

import styled from 'styled-components';

export const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 1000;
  background-color: #1e1e1e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100px;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 0.9rem;

  @media (max-width: 1200px) {
    margin-right: 20px;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    margin-right: 15px;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    margin-right: 10px;
    font-size: 0.6rem;
  }

  color: #e0e0e0;
`;
export const TopInfoSection = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoIcon = styled.img`
  width: 40px;
  height: 40px;
  min-width: 30px;
  min-height: 30px;

  object-fit: contain;
  aspect-ratio: 1;

  @media (max-width: 1200px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

export const Icon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 5px;
`;

export const UserWrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const UserRole = styled.span<{ role?: string }>`
  color: ${(props) =>
    props.role === 'OPERATOR' || props.role === 'MANAGER' ? 'red' : 'black'};
  font-weight: ${(props) =>
    props.role === 'OPERATOR' || props.role === 'MANAGER' ? 'bold' : 'normal'};
  margin-bottom: 5px;
  margin-right: 5px;
`;

export const UserName = styled.span`
  font-size: 0.9rem;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #e0e0e0;
`;

export const ActionButtons = styled.div`
  display: flex;
`;

export const ActionButton = styled.button`
  background-color: #2c2c2c;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #e0e0e0;

  &:hover {
    background-color: #3a3a3a;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 10px 0;
  margin-top: 10px;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 20px;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const NavMenu = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  align-items: center;

  color: #e0e0e0;
`;

export const CloseButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const NavMenuLink = styled.span`
  cursor: pointer;
  margin-bottom: 10px;
`;

export const SubMenu = styled.ul`
  position: absolute;
  background-color: #2c2c2c;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  margin-top: 30px;
  z-index: 1;
  min-width: 150px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &:hover {
    opacity: 1;
    visibility: visible;
  }
`;

export const TradingViewOverviewContainer = styled.div`
  align-items: center;
  width: 700px;
`;

export const SubMenuItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;
  white-space: nowrap;
  text-align: left;
  color: #e0e0e0;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #3a3a3a;
    color: #ffd700;
  }
`;

export const NavMenuItem = styled.li`
  cursor: pointer;

  font-weight: 700;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding-bottom: 20px;
  color: #e0e0e0;
  transition: color 0.3s ease;
  margin-right: 40px;
  font-size: 0.9rem;

  @media (max-width: 1200px) {
    margin-right: 30px;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    margin-right: 20px;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    margin-right: 10px;
    font-size: 0.6rem;
  }

  &:hover {
    color: #ffd700;

    ${SubMenu} {
      display: block;
      opacity: 1;
      visibility: visible;
    }
  }
`;
