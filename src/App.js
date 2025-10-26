import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AllMeetupsPage from "./pages/AllMeetupsPage";
import FavoritesPage from "./pages/Favorites";
import NewMeetupsPage from "./pages/NewMeetup";

import MainNavigation from "./components/layout/MainNavigation";
import Layout from "./components/layout/Layout";

function App() {
  return (
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
  );
}

export default App;
