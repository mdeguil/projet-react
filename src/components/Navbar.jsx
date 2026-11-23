import { NavLink } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'
import useCart from '../hooks/useCart'

export default function Navbar() {
  const { favorites } = useFavorites()
  const { count } = useCart()
  return (
    <header className="navbar">
      <NavLink to="/catalogue" className="brand">
        🏴‍☠️ Grand Line Cards
      </NavLink>
      <nav>
        <NavLink to="/catalogue">Catalogue</NavLink>
        <NavLink to="/cards/new">Ajouter une carte</NavLink>
        <NavLink to="/favorites">★ Favoris ({favorites.length})</NavLink>
        <NavLink to="/cart">🛒 Panier ({count})</NavLink>
      </nav>
    </header>
  )
}
