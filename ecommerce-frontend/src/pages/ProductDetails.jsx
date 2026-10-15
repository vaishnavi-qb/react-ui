import { useState, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Star, ChevronRight, ArrowLeft } from 'lucide-react'
import { addToCart } from '../store/cartSlice'
import api from '../services/axios'
import useWindowEvent from '../hooks/useWindowEvent'
import '../styles/ProductDetails.scss'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useSelector(state => state.auth)
  const [selectedSize, setSelectedSize] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sizeError, setSizeError] = useState('')
  const [activeProductId, setActiveProductId] = useState(id)

  if (id !== activeProductId) {
    setActiveProductId(id)
    setSelectedSize('')
    setSizeError('')
  }

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`)
      return response.data
    },
    enabled: Boolean(id),
  })

  const addToCartMutation = useMutation({
    mutationFn: async (payload) => {
      await api.post('/cart', payload)
    },
    onSuccess: () => {
      // Only refresh cart cache — product catalogs do not need refetching
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape') {
      setShowLoginModal(false)
    }
  }, [])

  useWindowEvent('keydown', handleEscape)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (!selectedSize) {
      setSizeError('Please select a size')
      return
    }
    
    setSizeError('')
    const productId = product._id || product.id
    const payload = {
      product: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      qty: 1
    }

    dispatch(addToCart(payload))
    addToCartMutation.mutate(payload)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Loading product...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="loader-container">
          <p>Failed to load product</p>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {error?.message || 'Please try again later.'}
          </p>
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="loader-container">
          <p>Product not found</p>
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    )
  }

  const availableSizes = product.size || []

  return (
    <div className="product-details-page">
      <Navbar />
      
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>
              ×
            </button>
            <h2>Login Required</h2>
            <p>Please login to add items to your cart</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
              <button className="modal-btn login" onClick={() => navigate('/login', { state: { redirectToProductId: id } })}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="product-details-main">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/')}>HOME</span>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-item active">{product.name}</span>
        </div>

        <div className="product-details-content">
          <div className="product-images">

            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating || 0)}
              </div>
              {product.numReviews !== undefined && (
                <span className="review-count">({product.numReviews})</span>
              )}
            </div>

            <div className="product-pricing">
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
              <span className="current-price">${product.price}</span>
            </div>

            <p className="product-description">{product.description}</p>

            {availableSizes.length > 0 && (
              <div className="size-selector">
                <h3 className="size-label">Select Size</h3>
                <div className="size-options">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`size-button ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedSize(size)
                        setSizeError('')
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizeError && (
              <div className="size-error-message">
                {sizeError}
              </div>
            )}

            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? 'ADDING...' : 'ADD TO CART'}
            </button>

            {product.category && (
              <div className="product-category">
                <span className="label">Category :</span>
                <span className="value">{Array.isArray(product.category) ? product.category.join(', ') : product.category}</span>
              </div>
            )}

            {product.brand && (
              <div className="product-brand">
                <span className="label">Brand :</span>
                <span className="value">{product.brand}</span>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetails
