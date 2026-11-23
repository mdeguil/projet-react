import { useEffect, useState } from 'react'

// Les 3 états d'une requête : chargement, erreur, données.
// `fetcher` est une fonction qui renvoie une Promise ; `deps` indique quand relancer.
export default function useFetch(fetcher, deps) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false // évite de mettre à jour un composant démonté / une requête périmée
    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
