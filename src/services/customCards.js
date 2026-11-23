// Cartes créées par l'utilisateur via le formulaire.
// Pas de BDD et l'API est en lecture seule : on les garde dans le localStorage du navigateur.
const STORAGE_KEY = 'optcg-custom-cards'
export const CUSTOM_SET_ID = 'custom'

const COLOR_HEX = {
  Red: '#c0392b',
  Green: '#1e8449',
  Blue: '#2471a3',
  Purple: '#7d3c98',
  Black: '#2c3e50',
  Yellow: '#d4ac0d',
}

export function getCustomCards() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// Image de remplacement générée en SVG (data URI) : l'API ne fournit pas d'image pour nos cartes
function placeholderImage(name, color) {
  const bg = COLOR_HEX[color] ?? '#34495e'
  const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 40)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#0e1424"/></linearGradient></defs>` +
    `<rect width="300" height="420" rx="18" fill="url(#g)"/>` +
    `<rect x="12" y="12" width="276" height="396" rx="12" fill="none" stroke="#f5b83d" stroke-width="4"/>` +
    `<text x="150" y="190" font-size="64" text-anchor="middle">🏴‍☠️</text>` +
    `<text x="150" y="270" font-size="22" font-family="sans-serif" font-weight="700" fill="#fff" text-anchor="middle">${safeName}</text>` +
    `<text x="150" y="310" font-size="14" font-family="sans-serif" fill="#f5b83d" text-anchor="middle">Carte perso</text>` +
    `</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 Mo
const MAX_WIDTH = 400 // on réduit l'image : le localStorage est limité (~5 Mo au total)

// Lit un fichier image choisi par l'utilisateur et le renvoie réduit, en data URI JPEG
export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Le fichier doit être une image.'))
    if (file.size > MAX_FILE_SIZE) return reject(new Error('Image trop lourde (5 Mo maximum).'))

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Impossible de lire l'image."))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Image invalide.'))
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

// Écriture synchrone (pas de useEffect) : la page change juste après, rien ne doit se perdre
// `image` : data URI choisie par l'utilisateur (facultative, sinon image générée)
export function addCustomCard(form, image) {
  const card = {
    card_image_id: `custom-${Date.now()}`,
    card_set_id: 'PERSO',
    set_name: 'Mes cartes',
    card_name: form.card_name,
    card_color: form.card_color,
    card_type: form.card_type,
    card_power: form.card_power || null,
    card_cost: null,
    sub_types: null,
    card_text: null,
    rarity: 'Perso',
    market_price: Number(form.market_price),
    card_image: image || placeholderImage(form.card_name, form.card_color),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([card, ...getCustomCards()]))
  } catch {
    /* stockage plein ou bloqué : la carte ne sera pas conservée */
  }
  return card
}
