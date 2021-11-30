import { Link } from "react-router-dom";

import "./Navbar.scss";
import { useAppSelector } from "../../store";

function Navbar() {
  const { avatar, name, loggedIn } = useAppSelector(
    (state) => state.profileReducer
  );
  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <Link to="/" className="contrast" tabIndex={0}>
            <strong>Memoastic</strong>
          </Link>
        </li>
      </ul>
      {loggedIn && (
        <div className="profile">
          Hello,
          <img
            alt={avatar}
            height={32}
            width={32}
            src={require(`../../assets/avatars/${avatar}.png`).default}
          />
          <span>{name}</span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
