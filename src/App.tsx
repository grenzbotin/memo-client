import {
  Route,
  BrowserRouter,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./store";
import Login from "./pages/Login";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import { useEffect } from "react";
import { changeMode } from "./store/slices/profile";

function RequireLogin({ children }: { children: JSX.Element }) {
  const { name } = useAppSelector((state) => state.profileReducer);
  const location = useLocation();

  if (!name) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

const useQuery = () => new URLSearchParams(useLocation().search);

function GameRoutes() {
  const { current } = useAppSelector((state) => state.gamesReducer);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useQuery();

  // If game got started, let user switch to game page
  useEffect(() => {
    if (current && location.pathname !== "/game") {
      navigate("/game");
    }
  }, [current, navigate, location.pathname]);

  useEffect(() => {
    const mode = query.get("mode");
    if (mode && mode !== "") {
      dispatch(changeMode({ mode }));
    }
  }, [query, dispatch]);

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
    </BrowserRouter>
  );
}

export default App;
