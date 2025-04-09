import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from './header'; // update path if needed

const HeaderWithNav = () => {
  const navigate = useNavigate();
  return <HeaderComponent navigate={navigate} />;
};

export default HeaderWithNav;
