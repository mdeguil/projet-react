import { useContext } from 'react'
import { FavoritesContext } from '../context/favoritesContext'

// { favorites, isFavorite(id), toggleFavorite(character), clearFavorites() }
export default function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites doit être utilisé dans un <FavoritesProvider>')
  return ctx
}
