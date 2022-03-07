import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import styled from 'styled-components';

import ArrowDown from './ArrowDown';

const routes = [
  { path: "/flow", name: 'Flow', index: true },
  { path: "/ethereum", name: 'Ethereum' },
  { path: "/bsc", name: 'BSC' },
  { path: "/solana", name: 'Solana' },
];

const SelectComp = styled.div`
  display: flex;
  width: 300px;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  margin: 0 0 60px;
  border-radius: 60px;
  background: #f7f7f7;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
`;

const Options = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  width: 100%;
  padding: 20px 0;
  border-radius: 18px;
  background: #f7f7f7;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
`;

const Option = styled.div`
  height: 50px;
  line-height: 50px;
  padding: 0 40px;
  font-weight: ${props => props.isCurrentChain ? 500 : 400};
  
  &:hover {
    background: #eaeaea;
    font-weight: 500;
  }
`;

function Select() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickSelect = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };
  
  const currentRouteName = routes.find(route => route.path === pathname)?.name ?? routes.find(route => route.index)?.name;
  return (
    <SelectComp onClick={handleClickSelect}>
      {currentRouteName}
      <ArrowDown />
      <Options isOpen={isOpen}>
        {routes.map((route) => (
          <Link key={route.name} to={route.path}>
            <Option isCurrentChain={currentRouteName === route.name}>
              {route.name}
            </Option>
          </Link>
        ))}
      </Options>
    </SelectComp>
  );
}

export default Select;
