// Affiche chargement / erreur à la place du contenu : jamais d'écran blanc.
export default function Status({ loading, error, onRetry, children }) {
  if (loading) return <p className="status" role="status">Chargement…</p>
  if (error) {
    return (
      <div className="status error" role="alert">
        <p>{error.message === 'Failed to fetch' ? 'Le serveur ne répond pas.' : error.message}</p>
        {onRetry && <button onClick={onRetry}>Réessayer</button>}
      </div>
    )
  }
  return children
}
