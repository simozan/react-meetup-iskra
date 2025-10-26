import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";

import AllMeetupsPage from "./pages/AllMeetupsPage";
import FavoritesPage from "./pages/Favorites";
import NewMeetupsPage from "./pages/NewMeetup";

import MainNavigation from "./components/layout/MainNavigation";
import Layout from "./components/layout/Layout";

export const FavoritesContext = createContext({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

function App() {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (meetup) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.find(fav => fav.id === meetup.id)) {
        return [...prevFavorites, meetup];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (meetupId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter(fav => fav.id !== meetupId)
    );
  };

  const isFavorite = (meetupId) => {
    return favorites.some(fav => fav.id === meetupId);
  };

  const favoritesContextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={favoritesContextValue}>
      <Router>
        <div data-test="app">
          <MainNavigation />
          <Layout>
            <Routes>
              <Route path="/" element={<AllMeetupsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/new-meetup" element={<NewMeetupsPage />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </FavoritesContext.Provider>
  );
}

export default App;
