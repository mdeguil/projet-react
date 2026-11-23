import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Catalog from './pages/Catalog'
import CardDetail from './pages/CardDetail'
import Favorites from './pages/Favorites'
import NewCard from './pages/NewCard'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogue" replace />} />
          <Route path="/catalogue" element={<Catalog />} />
          <Route path="/cards/new" element={<NewCard />} />
          <Route path="/cards/:id" element={<CardDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
