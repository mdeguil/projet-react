import { useEffect, useState } from 'react'
import { FavoritesContext } from './favoritesContext'

const STORAGE_KEY = 'optcg-favorites'

// Lecture protégée du localStorage : JSON invalide ou stockage bloqué => liste vide
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// Le Provider est placé au-dessus du routeur (main.jsx) : les favoris ne sont donc
// jamais réinitialisés quand on change de page.
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites) // fonction => exécutée une seule fois

  // À chaque changement de la liste, on la sauvegarde
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* stockage plein ou bloqué : les favoris restent en mémoire */
    }
  }, [favorites])

  const isFavorite = (id) => favorites.some((f) => f.card_image_id === id)

  // On ne garde que les champs utiles pour afficher la page Favoris sans refaire d'appel API
  const toggleFavorite = (card) =>
    setFavorites((prev) =>
      prev.some((f) => f.card_image_id === card.card_image_id)
        ? prev.filter((f) => f.card_image_id !== card.card_image_id)
        : [
            ...prev,
            {
              card_image_id: card.card_image_id,
              card_name: card.card_name,
              card_image: card.card_image,
              market_price: card.market_price,
              set_name: card.set_name,
              card_color: card.card_color,
              rarity: card.rarity,
            },
          ],
    )

  const clearFavorites = () => setFavorites([])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}
