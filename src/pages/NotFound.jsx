import { Link } from 'react-router-dom'

// Drapeau pirate dessiné en SVG (chapeau de paille + tête de mort + os croisés)
function JollyRoger() {
  return (
    <svg className="jolly" viewBox="0 0 200 200" role="img" aria-label="Drapeau pirate au chapeau de paille">
      {/* os croisés */}
      <g stroke="#f4ecd8" strokeWidth="10" strokeLinecap="round">
        <line x1="40" y1="150" x2="160" y2="185" />
        <line x1="160" y1="150" x2="40" y2="185" />
      </g>
      {/* crâne */}
      <path d="M100 62c-30 0-50 20-50 46 0 16 8 26 18 32v14h64v-14c10-6 18-16 18-32 0-26-20-46-50-46z" fill="#f4ecd8" />
      <circle cx="80" cy="108" r="11" fill="#0e1424" />
      <circle cx="120" cy="108" r="11" fill="#0e1424" />
      <path d="M100 120l-6 12h12z" fill="#0e1424" />
      <path d="M82 148v10M94 148v10M106 148v10M118 148v10" stroke="#0e1424" strokeWidth="3" />
      {/* chapeau de paille */}
      <ellipse cx="100" cy="66" rx="68" ry="16" fill="#e8b84a" />
      <path d="M62 64c0-30 76-30 76 0z" fill="#f2c95c" />
      <path d="M62 62h76v9H62z" fill="#c8322f" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <section className="notfound">
      <JollyRoger />
      <p className="nf-code">404</p>
      <h1>Perdu sur la Grand Line !</h1>
      <p className="muted">
        Cette page a disparu dans la brume… Même le meilleur navigateur ne retrouve pas ce trésor.
      </p>
      <p className="nf-icons" aria-hidden="true">
        🏴‍☠️ 🍖 🧭 ⚓ 🍊 🗺️
      </p>
      <div className="actions">
        <Link to="/catalogue" className="btn primary">
          ⚓ Retour au catalogue
        </Link>
        <Link to="/favorites" className="btn">
          ★ Mes favoris
        </Link>
      </div>
    </section>
  )
}
