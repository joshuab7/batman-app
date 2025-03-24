import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Registration from './pages/Registration';
import CharactersPage from './pages/CharactersPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import FavoritesPage from './pages/FavoritesPage';  
import './index.css';
import './App.css';
function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
        <Router>
          <div className="App">
            <Navbar />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/characters/:id" element={<CharacterDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;