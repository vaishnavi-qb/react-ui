import { useState, useEffect, useCallback, useEffectEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Lock, Plus, Trash2 } from 'lucide-react' 
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/Checkout.scss'
import api from '../services/axios'
import { loadStripe } from '@stripe/stripe-js'
import { checkoutSchema } from './checkoutSchema'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const normalizeAddress = (address) => ({
    ...address,
    id: address.id || address._id
})

const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phoneNumber: '',
    shippingMethod: 'standard'
}

const Checkout = () => {
    const navigate = useNavigate()
    const { items, totalAmount } = useSelector(state => state.cart)
    const { isAuthenticated } = useSelector(state => state.auth)

    const [savedAddresses, setSavedAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState('new')
    const [saveNewAddress, setSaveNewAddress] = useState(false)
    const [isLoadingAddress, setIsLoadingAddress] = useState(isAuthenticated)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: initialFormState
    })

    const shippingMethod = watch('shippingMethod')
    const country = watch('country')

    const fetchSavedAddresses = useCallback(async () => {
        setIsLoadingAddress(true)
        try {
            const response = await api.get('/users/address')
            const currentShipping = getValues('shippingMethod') || 'standard'

            const processedAddresses = Array.isArray(response.data?.address)
                ? response.data.address.map(normalizeAddress)
                : []

            if (processedAddresses.length > 0) {
                const preservedSelection = processedAddresses.find(addr => addr.id === selectedAddressId)
                const defaultAddr = preservedSelection || processedAddresses[0]

                setSavedAddresses(processedAddresses)
                setSelectedAddressId(defaultAddr.id)
                reset({ ...defaultAddr, shippingMethod: currentShipping })
            } else {
                setSavedAddresses([])
                setSelectedAddressId('new')
                reset({ ...initialFormState, shippingMethod: currentShipping })
            }
        } catch (error) {
            console.error('Failed to retrieve addresses profile:', error)
            setSavedAddresses([])
            setSelectedAddressId('new')
            reset({ ...initialFormState, shippingMethod: getValues('shippingMethod') || 'standard' })
        } finally {
            setIsLoadingAddress(false)
        }
    }, [selectedAddressId, reset, getValues])

    const loadSavedAddresses = useEffectEvent(() => {
        if (isAuthenticated) {
            fetchSavedAddresses()
            return
        }

        setSavedAddresses([])
        setSelectedAddressId('new')
        reset(initialFormState)
        setIsLoadingAddress(false)
    })

    useEffect(() => {
        queueMicrotask(loadSavedAddresses)
    }, [isAuthenticated])

    const shippingFees = {
        standard: 8.00,
        express: 18.00
    }

    const selectedShippingFee = shippingFees[shippingMethod] ?? shippingFees.standard
    const taxRate = 0.075
    const subtotal = totalAmount
    const tax = subtotal * taxRate
    const total = subtotal + selectedShippingFee + tax

    const regionsByCountry = {
        India: [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
            'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
            'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
            'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
        ]
    }

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id)
        if (id === 'new') {
            reset({ ...initialFormState, shippingMethod })
        } else {
            const address = savedAddresses.find(addr => addr.id === id)
            if (address) {
                reset({ ...address, shippingMethod })
            }
        }
    }

    const handleDeleteAddress = async (e, id) => {
        e.stopPropagation()
        
        try {
            await api.delete(`/users/address/${id}`)
            
            if (selectedAddressId === id) {
                setSelectedAddressId('new')
                reset(initialFormState)
            }
            
            await fetchSavedAddresses()
        } catch (error) {
            console.error("Failed to delete address:", error)
        }
    }

    const onSubmit = async (formData) => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        try {
            if (selectedAddressId === 'new' && saveNewAddress && savedAddresses.length < 3) {
                const addressPayload = { ...formData }
                delete addressPayload.shippingMethod
                delete addressPayload.id
                await api.post('/users/address', addressPayload)
                await fetchSavedAddresses()
            }

            const response = await api.post('/payments/create-checkout-session', {
                items,
                shippingDetails: formData,
                orderSummary: {
                    subtotal,
                    tax,
                    shipping: selectedShippingFee,
                    total
                }
            })

            const { sessionId, url } = response.data
            const stripe = await stripePromise
            if (!stripe) return

            if (url) {
                window.location.href = url
            } else {
                const result = await stripe.redirectToCheckout({ sessionId })
                if (result.error) alert(result.error.message)
            }
        } catch (error) {
            console.error("Checkout process encountered an error:", error)
        }
    }

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <Navbar />
                <main className="checkout-main">
                    <div className="empty-checkout">
                        <h2>Your cart is empty</h2>
                        <p>Add some products before checking out!</p>
                        <button onClick={() => navigate('/')} className="continue-shopping-btn">
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const isFormLocked = selectedAddressId !== 'new'

    return (
        <div className="checkout-page">
            <Navbar />

            <main className="checkout-main">
                <h1 className="checkout-title">CHECKOUT</h1>

                <div className="checkout-content">
                    <div className="shipping-section">
                        {!isLoadingAddress && savedAddresses.length > 0 && (
                            <div className="saved-addresses-wrapper">
                                <h2>Select Delivery Address</h2>
                                <div className="saved-addresses-grid">
                                    {savedAddresses.map((addr) => (
                                        <div 
                                            key={addr.id} 
                                            className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`}
                                            onClick={() => handleAddressSelect(addr.id)}
                                        >
                                            <div className="card-header">
                                                <span className="name">{addr.firstName} {addr.lastName}</span>
                                                <div className="card-actions">
                                                    <button 
                                                        type="button" 
                                                        className="delete-address-btn"
                                                        onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                        title="Delete Address"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="address-text">{addr.shippingAddress}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                                            <p className="phone-text">Phone: {addr.phoneNumber}</p>
                                        </div>
                                    ))}
                                    
                                    {savedAddresses.length < 4 && (
                                        <div 
                                            className={`address-card add-new-card ${selectedAddressId === 'new' ? 'active' : ''}`}
                                            onClick={() => handleAddressSelect('new')}
                                        >
                                            <Plus size={24} />
                                            <span>Use a new address</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <h2>{selectedAddressId === 'new' ? 'Add New Shipping Information' : 'Shipping Information'}</h2>

                        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        disabled={isFormLocked}
                                        aria-invalid={errors.firstName ? 'true' : 'false'}
                                        aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                                        {...register('firstName')}
                                    />
                                    {errors.firstName && (
                                        <span id="firstName-error" className="field-error" role="alert">
                                            {errors.firstName.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        disabled={isFormLocked}
                                        aria-invalid={errors.lastName ? 'true' : 'false'}
                                        aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                                        {...register('lastName')}
                                    />
                                    {errors.lastName && (
                                        <span id="lastName-error" className="field-error" role="alert">
                                            {errors.lastName.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address <span className="required-star" aria-hidden="true">*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    disabled={isFormLocked}
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <span id="email-error" className="field-error" role="alert">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="shippingAddress">Shipping Address <span className="required-star" aria-hidden="true">*</span></label>
                                <input
                                    id="shippingAddress"
                                    type="text"
                                    disabled={isFormLocked}
                                    aria-invalid={errors.shippingAddress ? 'true' : 'false'}
                                    aria-describedby={errors.shippingAddress ? 'shippingAddress-error' : undefined}
                                    {...register('shippingAddress')}
                                />
                                {errors.shippingAddress && (
                                    <span id="shippingAddress-error" className="field-error" role="alert">
                                        {errors.shippingAddress.message}
                                    </span>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        id="city"
                                        type="text"
                                        disabled={isFormLocked}
                                        aria-invalid={errors.city ? 'true' : 'false'}
                                        aria-describedby={errors.city ? 'city-error' : undefined}
                                        {...register('city')}
                                    />
                                    {errors.city && (
                                        <span id="city-error" className="field-error" role="alert">
                                            {errors.city.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="zipCode">ZIP/Postal Code <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        id="zipCode"
                                        type="text"
                                        disabled={isFormLocked}
                                        aria-invalid={errors.zipCode ? 'true' : 'false'}
                                        aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                                        {...register('zipCode')}
                                    />
                                    {errors.zipCode && (
                                        <span id="zipCode-error" className="field-error" role="alert">
                                            {errors.zipCode.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="country">Country <span className="required-star" aria-hidden="true">*</span></label>
                                    <select
                                        id="country"
                                        disabled={isFormLocked}
                                        aria-invalid={errors.country ? 'true' : 'false'}
                                        aria-describedby={errors.country ? 'country-error' : undefined}
                                        {...register('country')}
                                    >
                                        <option value="India">India</option>
                                    </select>
                                    {errors.country && (
                                        <span id="country-error" className="field-error" role="alert">
                                            {errors.country.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State <span className="required-star" aria-hidden="true">*</span></label>
                                    <select
                                        id="state"
                                        disabled={isFormLocked}
                                        aria-invalid={errors.state ? 'true' : 'false'}
                                        aria-describedby={errors.state ? 'state-error' : undefined}
                                        {...register('state')}
                                    >
                                        <option value="">Select State</option>
                                        {(regionsByCountry[country] || []).map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state && (
                                        <span id="state-error" className="field-error" role="alert">
                                            {errors.state.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number <span className="required-star" aria-hidden="true">*</span></label>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    disabled={isFormLocked}
                                    aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                                    aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                                    {...register('phoneNumber')}
                                />
                                {errors.phoneNumber && (
                                    <span id="phoneNumber-error" className="field-error" role="alert">
                                        {errors.phoneNumber.message}
                                    </span>
                                )}
                            </div>

                            {selectedAddressId === 'new' && savedAddresses.length < 3 && (
                                <div className="checkbox-group save-address-checkbox">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                        />
                                        <span>Save this address</span>
                                    </label>
                                </div>
                            )}

                            {savedAddresses.length >= 3 && (
                                <p className="address-limit-info">
                                    Try deleting any of the saved address to save a new address.
                                </p>
                            )}

                            <div className="shipping-method">
                                <h3>Shipping Method</h3>
                                <div className="shipping-options">
                                    <label className="shipping-option">
                                        <input
                                            type="radio"
                                            value="standard"
                                            {...register('shippingMethod')}
                                        />
                                        <span>Standard (3-5 days) - $8.00</span>
                                    </label>
                                    <label className="shipping-option">
                                        <input
                                            type="radio"
                                            value="express"
                                            {...register('shippingMethod')}
                                        />
                                        <span>Express (1-2 days) - $18.00</span>
                                    </label>
                                </div>
                                {errors.shippingMethod && (
                                    <span id="shippingMethod-error" className="field-error" role="alert">
                                        {errors.shippingMethod.message}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-header">
                            <span>Products</span>
                            <span>Price</span>
                        </div>

                        <div className="products-list">
                            {items.map((item, index) => (
                                <div key={`${item.product}-${item.size}`} className="summary-product">
                                    <div className="product-info">
                                        <span className="product-number">{index + 1}.</span>
                                        <img src={item.image} alt={item.name} className="product-image" />
                                        <div className="product-details">
                                            <p className="product-name">{item.name}</p>
                                            <p className="product-qty">Qty: {item.qty}</p>
                                            {item.qty > 1 && (
                                                <p className="product-unit-price">${item.price} each</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="product-price">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="total-items">
                                Total Items: {items.reduce((acc, item) => acc + item.qty, 0)}
                            </div>

                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="total-row">
                                <span>Shipping:</span>
                                <span>${selectedShippingFee.toFixed(2)} ({shippingMethod === 'standard' ? 'Standard' : 'Express'})</span>
                            </div>

                            <div className="total-row">
                                <span>{`Tax ${country === 'UAE' ? '(VAT)' : '(GST)'}:`}</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>

                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className="payment-btn"
                            form='checkout-form'
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            <Lock size={18} />
                            {isSubmitting ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Checkout
