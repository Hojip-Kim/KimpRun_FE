'use client';

import styled from 'styled-components';

export const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 0.9rem;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;
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
`;

export const UserName = styled.span`
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

export const ActionButtons = styled.div`
  display: flex;
`;

export const ActionButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8rem;

  &:hover {
    background-color: #e0e0e0;
  }
`;
export const BottomSection = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  height: 0px;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 30px;
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
  display: none;
  position: absolute;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  z-index: 1;
  min-width: 150px;
  top: 100%;
  left: 0;
`;

export const SubMenuItem = styled.li`
  padding: 10px 20px;
  cursor: pointer;
  white-space: nowrap;
  text-align: left;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const NavMenuItem = styled.li`
  margin-right: 20px;
  cursor: pointer;
  font-size: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
  position: relative;
  padding-bottom: 20px;

  &:hover {
    color: #007bff;

    ${SubMenu} {
      display: block;
    }
  }
`;
