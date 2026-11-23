import { Link } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'
import CardItem from '../components/CardItem'

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <section>
        <h1>Favoris</h1>
        <p className="muted">
          Aucun favori pour l'instant. <Link to="/catalogue">Parcourir le catalogue</Link> et cliquer sur ☆.
        </p>
      </section>
    )
  }

  return (
    <section>
      <h1>Favoris</h1>
      <div className="grid">
        {favorites.map((f) => (
          <CardItem key={f.card_image_id} card={f} />
        ))}
      </div>
      <p className="total">
        Total : <strong>{favorites.length}</strong> carte(s) en favoris
      </p>
      <button className="danger" onClick={clearFavorites}>
        Tout retirer
      </button>
    </section>
  )
}
