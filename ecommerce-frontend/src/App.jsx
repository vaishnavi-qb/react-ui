import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { restoreAuth } from './store/authSlice'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetails from './pages/ProductDetails'
import api from './services/axios'

function App() {
  const dispatch = useDispatch();

  // Restore session from HTTP-only jwt cookie via profile endpoint
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const { data } = await api.get('/users/profile');
        if (cancelled) return;

        dispatch(restoreAuth({
          user: {
            id: data._id,
            name: data.name,
            email: data.email,
          },
        }));
      } catch {
        // No valid cookie session — remain logged out
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mens" element={<Home />} />
      <Route path="/womens" element={<Home />} />
      <Route path="/kids" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
    </Routes>
  )
}

export default App
