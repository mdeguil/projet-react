# Grand Line Cards — projet final React

Auteurs : DEGUIL - Matéo · API : https://optcgapi.com (cartes One Piece, lecture) + jsonplaceholder (POST de test) · Lancer : `npm install` puis `npm run dev`.

**Ce qui marche** : routage (catalogue, détail, ajout, favoris, panier, 404) sans rechargement, `/` redirige vers `/catalogue` ; détail `/cards/:id` avec les 3 états (un id inconnu affiche « Carte introuvable ») ; formulaire contrôlé `/cards/new` en `POST` avec redirection via `useNavigate`, avec image facultative (aperçu, réduite avant stockage), la carte créée est gardée dans le `localStorage` et affichée dans « Mes cartes » (catalogue + page détail) ; panier persistant `/cart` (`localStorage` + `useEffect`) avec quantités, total en $ et « Vider le panier » ; favoris persistants avec total (nombre de favoris) et « Tout retirer ».
**Bonus faits** : tri par prix, filtre par couleur, recherche, choix de l'extension, pagination (côté client), quantités dans le panier, hooks `useCart` et `useFavorites`.

**Ce qui ne marche pas / limites** : l'API des cartes est en lecture seule (POST => 405), donc le formulaire envoie son POST à jsonplaceholder, qui répond OK sans rien enregistrer, donc les cartes ajoutées ne vivent que dans le navigateur de l'utilisateur (pas de suppression possible) ; le 404 de l'API cartes n'a pas d'en-têtes CORS, donc le navigateur affiche une erreur dans la console sur un id inconnu (géré dans `services/api.js`) ; l'API est parfois lente (quelques secondes) ; le panier n'a pas de paiement (simple liste et total) ; pas de tests automatisés.

**Ce que l'IA a écrit** : l'IA (Claude) a généré l'ensemble du code (pour l'interface UX) et ce README.
