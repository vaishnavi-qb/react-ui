import { z } from 'zod'

export const checkoutSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, 'First name must be at least 3 characters'),
    lastName: z
      .string()
      .trim()
      .min(3, 'Last name must be at least 3 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    shippingAddress: z
      .string()
      .trim()
      .min(1, 'Shipping address is required'),
    city: z
      .string()
      .trim()
      .min(1, 'City is required'),
    state: z
      .string()
      .trim()
      .min(1, 'State is required'),
    zipCode: z
      .string()
      .trim()
      .min(1, 'ZIP/Postal code is required'),
    country: z
      .string()
      .trim()
      .min(1, 'Country is required'),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^[0-9]{7,15}$/, 'Phone number must be 7 to 15 digits'),
    shippingMethod: z.enum(['standard', 'express'], {
      message: 'Select a shipping method',
    }),
  })
  .superRefine((data, ctx) => {
    const zip = data.zipCode

    if (data.country === 'India') {
      if (!/^\d{6}$/.test(zip)) {
        ctx.addIssue({
          code: 'custom',
          path: ['zipCode'],
          message: 'India ZIP/postal code must be exactly 6 digits',
        })
      }
      return
    }

    if (!/^\d{5}$/.test(zip)) {
      ctx.addIssue({
        code: 'custom',
        path: ['zipCode'],
        message: 'ZIP/postal code must be exactly 5 digits',
      })
    }
  })
