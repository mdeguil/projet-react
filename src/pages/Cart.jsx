import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

export default function Cart() {
  const { items, count, total, setQuantity, removeFromCart, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <section>
        <h1>Panier</h1>
        <p className="muted">
          Votre panier est vide. <Link to="/catalogue">Parcourir le catalogue</Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      <h1>Panier</h1>
      <ul className="cart">
        {items.map((item) => (
          <li key={item.card_image_id}>
            <img src={item.card_image} alt="" />
            <div className="grow">
              <Link to={`/cards/${item.card_image_id}`}>{item.card_name}</Link>
              <p className="muted small">
                {item.set_name} · ${item.market_price.toFixed(2)} l'unité
              </p>
            </div>
            <span className="qty">
              <button onClick={() => setQuantity(item.card_image_id, item.quantity - 1)} aria-label="Diminuer la quantité">
                −
              </button>
              {item.quantity}
              <button onClick={() => setQuantity(item.card_image_id, item.quantity + 1)} aria-label="Augmenter la quantité">
                +
              </button>
            </span>
            <span className="price line-total">${(item.market_price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeFromCart(item.card_image_id)} aria-label={`Retirer ${item.card_name}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="total">
        {count} carte(s) · Total : <strong>${total.toFixed(2)}</strong>
      </p>
      <button className="danger" onClick={clearCart}>
        Vider le panier
      </button>
    </section>
  )
}
