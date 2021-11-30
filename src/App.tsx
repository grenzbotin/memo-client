import {
  Route,
  BrowserRouter,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAppSelector } from "./store";
import Login from "./containers/Login";
import Lobby from "./containers/Lobby";
import Footer from "./components/Footer";
import Game from "./components/Game";
import { useEffect } from "react";

function RequireLogin({ children }: { children: JSX.Element }) {
  const { name } = useAppSelector((state) => state.profileReducer);
  const location = useLocation();

  if (!name) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

function GameRoutes() {
  const { current } = useAppSelector((state) => state.gamesReducer);
  const location = useLocation();
  const navigate = useNavigate();

  // If game got started, let user switch to game page
  useEffect(() => {
    if (current && location.pathname !== "/game") {
      navigate("/game");
    }
  }, [current, navigate, location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireLogin>
            <Lobby />
          </RequireLogin>
        }
      />
      <Route
        path="/game"
        element={
          <RequireLogin>
            <Game />
          </RequireLogin>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
