import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useFavorites from '../hooks/useFavorites'
import useCart from '../hooks/useCart'
import { getCard } from '../services/api'
import Status from '../components/Status'

export default function CardDetail() {
  const { id } = useParams() // l'id vient de l'URL /cards/:id
  const { data: c, loading, error } = useFetch(() => getCard(id), [id])
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart } = useCart()
  const [zoom, setZoom] = useState(false) // image agrandie (lightbox) ou non

  // Échap ferme l'image agrandie
  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  return (
    <section>
      <Link to="/catalogue">← Retour au catalogue</Link>
      <Status loading={loading} error={error}>
        {c && (
          <div className="detail">
            <div>
              <button className="zoom-btn" onClick={() => setZoom(true)} aria-label="Agrandir l'image">
                <img src={c.card_image} alt={c.card_name} />
              </button>
              <p className="zoom-hint">🔍 Cliquer pour agrandir</p>
            </div>
            <div>
              <h1>{c.card_name}</h1>
              <p className="muted">
                {c.set_name} · {c.card_set_id}
              </p>
              <p className="price big">${(c.market_price ?? 0).toFixed(2)}</p>
              <dl>
                <dt>Type</dt>
                <dd>{c.card_type}</dd>
                <dt>Couleur</dt>
                <dd>{c.card_color}</dd>
                <dt>Rareté</dt>
                <dd>{c.rarity}</dd>
                <dt>Coût</dt>
                <dd>{c.card_cost ?? '—'}</dd>
                <dt>Puissance</dt>
                <dd>{c.card_power ?? '—'}</dd>
                <dt>Famille</dt>
                <dd>{c.sub_types ?? '—'}</dd>
              </dl>
              {c.card_text && <p className="card-text">{c.card_text}</p>}
              <div className="actions">
                <button className="primary" onClick={() => addToCart(c)}>
                  🛒 Ajouter au panier
                </button>
                <button onClick={() => toggleFavorite(c)}>
                  {isFavorite(c.card_image_id) ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Status>

      {zoom && c && (
        <div className="lightbox" role="dialog" aria-label={`${c.card_name} en grand`} onClick={() => setZoom(false)}>
          <button className="close" aria-label="Fermer">
            ✕
          </button>
          <img src={c.card_image} alt={c.card_name} />
        </div>
      )}
    </section>
  )
}
