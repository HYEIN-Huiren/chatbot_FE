/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.07.24
 * @description: ReactDOM을 이용한 시작점 컴포넌트
 ***************************************************************************
 * */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
