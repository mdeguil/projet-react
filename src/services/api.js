import { getCustomCards } from './customCards'

const CARDS_URL = 'https://optcgapi.com/api'
// L'API des cartes est en lecture seule (POST => 405). Pour le formulaire on utilise donc
// une API publique de test qui accepte les POST sans rien enregistrer.
const FAKE_POST_URL = 'https://jsonplaceholder.typicode.com/posts'

async function request(url, options) {
  const res = await fetch(url, options)
  // fetch ne lève PAS d'erreur sur un 4xx/5xx : on le fait nous-mêmes
  if (!res.ok) throw new Error(res.status === 404 ? 'Carte introuvable' : `Erreur serveur (${res.status})`)
  return res.json()
}

// Liste des extensions (sets) : [{ set_id: 'OP-01', set_name: 'Romance Dawn' }, ...]
export function getSets() {
  return request(`${CARDS_URL}/allSets/`)
}

// Toutes les cartes d'une extension
export function getSetCards(setId) {
  return request(`${CARDS_URL}/sets/${encodeURIComponent(setId)}/`)
}

// Une carte. Son id est `card_image_id` ("OP01-001" ou "OP01-001_p1" pour une version parallèle).
// L'API renvoie toutes les versions d'un même numéro : on choisit la bonne.
export async function getCard(id) {
  if (id.startsWith('custom-')) {
    // Carte créée par l'utilisateur : elle n'existe que dans le localStorage
    const custom = getCustomCards().find((c) => c.card_image_id === id)
    if (!custom) throw new Error('Carte introuvable')
    return custom
  }
  const base = id.split('_')[0]
  let variants
  try {
    variants = await request(`${CARDS_URL}/sets/card/${encodeURIComponent(base)}/`)
  } catch (err) {
    // Le 404 de cette API n'a pas d'en-têtes CORS : le navigateur le bloque et fetch échoue
    // avec "Failed to fetch", comme si le serveur était éteint. Pour les distinguer, on
    // vérifie que le serveur répond bien sur une route qui existe (la liste des sets).
    if (err.message === 'Failed to fetch') {
      await getSets() // si le serveur est réellement hors ligne, cette ligne relance l'erreur
      throw new Error('Carte introuvable')
    }
    throw err
  }
  const card = variants.find((c) => c.card_image_id === id)
  if (!card) throw new Error('Carte introuvable')
  return card
}

export function createCard(card) {
  return request(FAKE_POST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
}
