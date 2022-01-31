import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Router from './router';
import { getTokens } from './store/tokens';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTokens());
  }, [dispatch]);

  return (
    <div className="app">
      <div id="notification" />
      <div id="confirmation" />
      <Header />
      <div className="page-content">
        <Router />
      </div>
    </div>
  );
}

export default App;
