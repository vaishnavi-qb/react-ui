import { useCallback } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useWindowEvent from '../hooks/useWindowEvent'
import '../styles/Home.scss'
import api from '../services/axios'

const fetchProductsPage = async ({ pageParam, searchQuery, category }) => {
  let url = `/products?pageNumber=${pageParam}`

  if (searchQuery) {
    url = `/products?search=${encodeURIComponent(searchQuery)}`
  }

  if (category) {
    url += `&category=${encodeURIComponent(category.toLowerCase())}`
  }

  const response = await api.get(url)
  const products = response.data.products || response.data

  return {
    products: Array.isArray(products) ? products : [],
    page: pageParam,
  }
}

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const searchQuery = searchParams.get('search')
  const path = location.pathname.slice(1)
  const category = ['mens', 'womens', 'kids'].includes(path) ? path : null

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', { search: searchQuery, category }],
    queryFn: ({ pageParam }) =>
      fetchProductsPage({ pageParam, searchQuery, category }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Search results are a single page (matches previous load-more behavior)
      if (searchQuery) return undefined
      if (lastPage.products.length < 12) return undefined
      return lastPage.page + 1
    },
  })

  const filteredProducts = data?.pages.flatMap((page) => page.products) ?? []

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleScroll = useCallback(() => {
    const totalPageHeight = document.documentElement.scrollHeight
    const visibleViewportHeight = window.innerHeight
    const currentScrollPosition = window.scrollY

    const thresholdBuffer = 100
    const isNearBottom = (visibleViewportHeight + currentScrollPosition) >= (totalPageHeight - thresholdBuffer)

    if (isNearBottom) {
      handleLoadMore()
    }
  }, [handleLoadMore])

  useWindowEvent('scroll', handleScroll)

  const handleProductClick = (product) => {
    const productId = product._id || product.id
    navigate(`/product/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Loading products...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="loader-container">
          <p>Failed to load products</p>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {error?.message || 'Please try again later.'}
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="home-page">
      <Navbar />

      {!category && !searchQuery && (
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Exclusive
                <br />
                Offers For You
              </h1>
              <p className="hero-subtitle">ONLY ON BEST SELLERS PRODUCTS</p>
              <button className="hero-button">Check now</button>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80" alt="Latest Fashion" />
            </div>
          </div>
        </section>
      )}

      <main className="home-main">
        {searchQuery && (
          <div style={{ 
            padding: '1rem 2rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>
              Search results for: <strong>"{searchQuery}"</strong>
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="latest-products-section">
          <h2 className="latest-products-title">
            {!searchQuery ? 'Latest Products' : ''}
          </h2>
          <div className="title-underline"></div>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              color: '#666'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products found</h3>
              <p>
                {searchQuery
                  ? 'Try searching with different keywords'
                  : 'There are no products to show right now.'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const productId = product._id || product.id
              const displayPrice = product.price 
              
              return (
                <div
                  key={productId}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      loading='lazy'
                    />
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">
                      {product.name}
                    </h3>

                    <div className="product-prices">
                      <span className="current-price">${displayPrice}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {isFetchingNextPage && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '2rem 0',
            color: '#666', 
            fontWeight: '600', 
            fontSize: '1rem' 
          }}>
            Loading more products...
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Home
