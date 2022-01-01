import { Link } from "react-router-dom";

import "./Navbar.scss";
import { useAppSelector } from "../../store";
import Logo from "../../assets/logo.svg";

function Navbar() {
  const { avatar, name, loggedIn } = useAppSelector(
    (state) => state.profileReducer
  );
  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <Link to="/" className="contrast logo" tabIndex={0}>
            <img alt="" src={Logo} width={40} height={40} />
            Moneo
          </Link>
        </li>
      </ul>
      {loggedIn && (
        <div className="profile">
          Hello,
          <img
            alt={avatar}
            height={42}
            width={42}
            src={require(`../../assets/avatars/${avatar}.png`).default}
          />
          <span>{name}</span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
