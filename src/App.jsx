import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Authentication from './pages/auth/Authentication';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Authentication />} />
            <Route path='home' element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
