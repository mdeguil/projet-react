import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { getSetCards, getSets } from '../services/api'
import { CUSTOM_SET_ID, getCustomCards } from '../services/customCards'
import Status from '../components/Status'
import CardItem from '../components/CardItem'

const PAGE_SIZE = 24
const DEFAULT_SET = 'OP-01'

export default function Catalog() {
  const location = useLocation()
  const created = location.state?.created // message envoyé par /cards/new après le POST
  // Après un ajout, on ouvre directement « Mes cartes » pour voir la nouvelle carte
  const [setId, setSetId] = useState(created ? CUSTOM_SET_ID : DEFAULT_SET)
  const [search, setSearch] = useState('')
  const [color, setColor] = useState('')
  const [sort, setSort] = useState('') // '' | 'asc' | 'desc' (tri par prix)
  const [page, setPage] = useState(1)

  const sets = useFetch(getSets, [])
  // Les cartes sont rechargées à chaque changement d'extension ; « Mes cartes » vient du localStorage
  const { data, loading, error } = useFetch(
    () => (setId === CUSTOM_SET_ID ? Promise.resolve(getCustomCards()) : getSetCards(setId)),
    [setId],
  )

  const colors = useMemo(() => [...new Set((data ?? []).map((c) => c.card_color))].sort(), [data])

  // Recherche + filtre + tri recalculés uniquement quand leurs entrées changent
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = (data ?? []).filter(
      (c) => c.card_name.toLowerCase().includes(q) && (!color || c.card_color === color),
    )
    if (sort) list.sort((a, b) => ((a.market_price ?? 0) - (b.market_price ?? 0)) * (sort === 'asc' ? 1 : -1))
    return list
  }, [data, search, color, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Toute modification d'un filtre ramène à la page 1
  const onFilter = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  return (
    <section>
      <div className="hero">
        <h1>Catalogue des cartes</h1>
        <p>Explore le jeu de cartes One Piece extension par extension, trie par prix et garde tes préférées.</p>
      </div>

      {created && (
        <p className="notice" role="status">
          ✅ « {created} » a bien été ajoutée : retrouvez-la dans « Mes cartes » (conservée uniquement dans ce navigateur).
        </p>
      )}

      <div className="filters">
        <select aria-label="Extension" value={setId} onChange={onFilter(setSetId)}>
          <option value={CUSTOM_SET_ID}>★ Mes cartes (ajoutées)</option>
          {(sets.data ?? [{ set_id: DEFAULT_SET, set_name: 'Romance Dawn' }]).map((s) => (
            <option key={s.set_id} value={s.set_id}>
              {s.set_id} — {s.set_name}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Rechercher une carte…"
          aria-label="Rechercher une carte"
          value={search}
          onChange={onFilter(setSearch)}
        />
        <select aria-label="Couleur" value={color} onChange={onFilter(setColor)}>
          <option value="">Toutes les couleurs</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select aria-label="Trier par prix" value={sort} onChange={onFilter(setSort)}>
          <option value="">Ordre de l'API</option>
          <option value="desc">Prix décroissant</option>
          <option value="asc">Prix croissant</option>
        </select>
      </div>

      <Status loading={loading} error={error}>
        <p className="muted">{filtered.length} carte(s)</p>
        <div className="grid">
          {visible.map((c) => (
            <CardItem key={c.card_image_id} card={c} />
          ))}
        </div>
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Précédent
          </button>
          <span>
            Page {page} / {pages}
          </span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Suivant →
          </button>
        </div>
      </Status>
    </section>
  )
}
