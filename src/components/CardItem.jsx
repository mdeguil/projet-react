import { Link } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'
import useCart from '../hooks/useCart'

export default function CardItem({ card }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()
  const fav = isFavorite(card.card_image_id)

  return (
    <article className="card">
      <button
        className={`fav ${fav ? 'on' : ''}`}
        onClick={() => toggleFavorite(card)}
        aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        aria-pressed={fav}
      >
        {fav ? '★' : '☆'}
      </button>
      <Link to={`/cards/${card.card_image_id}`} className="card-link">
        <img src={card.card_image} alt={card.card_name} loading="lazy" />
        <h3>{card.card_name}</h3>
      </Link>
      <p className="muted small">{card.set_name}</p>
      <div className="card-foot">
        <span className="badge">{card.rarity}</span>
        <span className="price">${(card.market_price ?? 0).toFixed(2)}</span>
      </div>
      <button className="add" onClick={() => addToCart(card)}>
        🛒 Ajouter
      </button>
    </article>
  )
}
