import styled from 'styled-components';

// board row

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const CategoryTag = styled.span`
  display: inline-block;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 300;
  background-color: transparent;
`;

export const StyledRow = styled.div`
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #444;

  &:last-child {
    border-bottom: none;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #ffd700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const StatValue = styled.div`
  width: 60px;
  text-align: center;
  font-size: 14px;
  color: #e0e0e0;
`;

export const TitleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const StatsSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const NumberCell = styled.div`
  width: 60px;
`;

export const AuthorCell = styled.div`
  width: 100px;
  text-align: center;
`;

export const DateCell = styled.div`
  width: 150px;
  text-align: center;
`;

export const CategoryCell = styled.div`
  width: 100px;
  text-align: center;
  color: #e0e0e0;
`;

export const TitleCell = styled.div`
  flex: 1;
  padding: 0 16px;
`;

// board

export const BoardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1e1e1e;
  color: #e0e0e0;
  overflow-y: auto;
`;
export const CategoryHeader = styled.div`
  width: 100px;
  text-align: center;
`;

export const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const CategorySelect = styled.select`
  padding: 8px;
  font-size: 14px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
`;

export const WriteButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: #1e1e1e;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ffed4d;
  }
`;

export const PostList = styled.div`
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
`;

export const BoardListHeader = styled.div`
  display: flex;
  padding: 12px;
  background-color: #252525;
  border-bottom: 1px solid #444;
  font-weight: bold;
  color: #e0e0e0;
`;

export const NumberHeader = styled.div`
  width: 60px;
`;

export const TitleHeader = styled.div`
  flex: 1;
  text-align: center;
`;

export const AuthorHeader = styled.div`
  width: 100px;
  text-align: center;
`;

export const DateHeader = styled.div`
  width: 150px;
  text-align: center;
`;

export const StatHeader = styled.div`
  width: 60px;
  text-align: center;
`;

// category buttons

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const CategoryButton = styled.a<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#e0e0e0')};
  }
`;

// category layout

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: #e0e0e0;
`;

export const Header = styled.header`
  background-color: #2c2c2c;
  color: #e0e0e0;
  padding: 1rem 0;
  border-bottom: 1px solid #444;
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #ffd700;
`;

export const Nav = styled.nav`
  display: flex;
`;

export const NavItem = styled.div`
  margin-left: 1.5rem;

  a {
    color: #e0e0e0;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ffd700;
    }
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
`;

// pagination

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const PageButton = styled.button<{ isActive?: boolean }>`
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: ${(props) => (props.isActive ? '#ffd700' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : 'black')};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;