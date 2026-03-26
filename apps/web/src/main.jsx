import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Checkout from './pages/Checkout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/p/:slug" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
