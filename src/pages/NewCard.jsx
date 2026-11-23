import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCard } from '../services/api'
import { addCustomCard, readImageFile } from '../services/customCards'

const COLORS = ['Red', 'Green', 'Blue', 'Purple', 'Black', 'Yellow']
const TYPES = ['Leader', 'Character', 'Event', 'Stage']
const INITIAL = { card_name: '', card_color: 'Red', card_type: 'Character', card_power: '', market_price: '' }

export default function NewCard() {
  const [form, setForm] = useState(INITIAL) // champs contrôlés : React détient les valeurs
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [image, setImage] = useState('') // data URI de l'image choisie (aperçu + enregistrement)
  const navigate = useNavigate()

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return setImage('')
    try {
      setImage(await readImageFile(file))
      setError(null)
    } catch (err) {
      setImage('')
      e.target.value = '' // vide le champ pour pouvoir re-choisir un fichier
      setError(err.message)
    }
  }

  // Un seul handler pour tous les champs grâce à l'attribut `name`
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault() // empêche le rechargement de la page
    setSubmitting(true)
    setError(null)
    try {
      await createCard({ ...form, market_price: Number(form.market_price) }) // POST vers l'API de test
      addCustomCard(form, image) // et on garde la carte localement pour pouvoir l'afficher
      navigate('/catalogue', { state: { created: form.card_name } }) // redirection après succès
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Le serveur ne répond pas.' : err.message)
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h1>Ajouter une carte</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nom de la carte
          <input name="card_name" value={form.card_name} onChange={handleChange} required minLength={2} />
        </label>
        <label>
          Couleur
          <select name="card_color" value={form.card_color} onChange={handleChange}>
            {COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select name="card_type" value={form.card_type} onChange={handleChange}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Puissance
          <input name="card_power" type="number" min="0" step="500" value={form.card_power} onChange={handleChange} />
        </label>
        <label>
          Prix ($)
          <input
            name="market_price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.market_price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Image (facultative)
          <input type="file" accept="image/*" onChange={handleImage} />
        </label>
        {image && <img className="preview" src={image} alt="Aperçu de la carte" />}
        {error && (
          <p className="status error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? 'Envoi…' : 'Ajouter la carte'}
        </button>
      </form>
    </section>
  )
}
