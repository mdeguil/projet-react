import { useContext } from 'react'
import { CartContext } from '../context/cartContext'

// { items, count, total, addToCart(card), setQuantity(id, n), removeFromCart(id), clearCart() }
export default function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>')
  return ctx
}
