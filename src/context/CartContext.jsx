import { useEffect, useState } from 'react'
import { CartContext } from './cartContext'

const STORAGE_KEY = 'optcg-cart'

// Lecture protégée du localStorage : JSON invalide ou stockage bloqué => panier vide
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// Le Provider est placé au-dessus du routeur (main.jsx) : le panier n'est donc jamais
// réinitialisé quand on change de page.
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart) // fonction => exécutée une seule fois

  // À chaque modification du panier, on le sauvegarde
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* stockage plein ou bloqué : le panier reste en mémoire */
    }
  }, [items])

  // Ajoute la carte, ou +1 si elle est déjà dans le panier
  const addToCart = (card) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.card_image_id === card.card_image_id)
      if (existing) {
        return prev.map((i) => (i.card_image_id === card.card_image_id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        {
          card_image_id: card.card_image_id,
          card_name: card.card_name,
          card_image: card.card_image,
          set_name: card.set_name,
          market_price: card.market_price ?? 0,
          quantity: 1,
        },
      ]
    })

  // Une quantité <= 0 retire la ligne
  const setQuantity = (id, quantity) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.card_image_id !== id)
        : prev.map((i) => (i.card_image_id === id ? { ...i, quantity } : i)),
    )

  const removeFromCart = (id) => setItems((prev) => prev.filter((i) => i.card_image_id !== id))
  const clearCart = () => setItems([])

  // Valeurs dérivées : recalculées à chaque rendu, jamais stockées
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.market_price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, addToCart, setQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
