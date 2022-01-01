import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store";
import { WebSocketContext } from "../WebsocketContext";
import { changeAvatar, changeName } from "../../store/slices/profile";
import {
  ALPHA_PASSWORD,
  USERNAME_MAX_LENGTH,
  USERNAME_REGEX,
} from "../../configs/game";
import { AVATARS } from "../../assets/avatars";
import "./LoginForm.scss";
import { isPasswordProtected } from "../../configs/settings";
import Modal from "../Modal";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login } = useContext(WebSocketContext);
  const [avatarModal, setAvatarModal] = useState(false);

  const { name, avatar, loggedIn, error } = useAppSelector(
    (state) => state.profileReducer
  );

  // ALPHA
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ name, avatar });
  };

  const handleSelectAvatar = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLImageElement>,
    avatar: string
  ) => {
    e.stopPropagation();
    dispatch(changeAvatar({ avatar }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Prevent user from typing other than numbers/letters
    if (USERNAME_REGEX.test(e.target.value)) {
      dispatch(changeName({ name: e.target.value }));
    }
  };

  const handleAvatarClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAvatarModal(false);
  };

  const isJoinDisabled =
    !name ||
    name.length > USERNAME_MAX_LENGTH ||
    !USERNAME_REGEX.test(name) ||
    (isPasswordProtected && password !== ALPHA_PASSWORD);

  return (
    <>
      {avatarModal && (
        <Modal
          id="requestModal"
          modalContent={
            <span className="avatar-selector">
              <p>Select your avatar:</p>
              {AVATARS.map((image) => (
                <img
                  key={image}
                  alt={image}
                  className={avatar === image ? "selected" : ""}
                  src={require(`../../assets/avatars/${image}.png`).default}
                  onClick={(e) => handleSelectAvatar(e, image)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSelectAvatar(e, image)
                  }
                  tabIndex={0}
                />
              ))}
            </span>
          }
          modalActions={{
            primary: {
              action: handleAvatarClose,
              text: "Close",
            },
          }}
        />
      )}
      <div>
        <hgroup>
          <h1>Welcome!</h1>
          <h2>
            Give yourself a name, choose youre preferred player avatar and go
            for it.
          </h2>
        </hgroup>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={name}
            onChange={handleNameChange}
            required
          />
          {isPasswordProtected && (
            <input
              type="text"
              name="password"
              placeholder="fourty-three plus thirty-two?"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          <button
            type="button"
            className="secondary btn-select-avatar"
            onClick={() => setAvatarModal(true)}
          >
            Select Avatar
          </button>
          <button disabled={isJoinDisabled} type="submit">
            Join
          </button>
          {error && error}
        </form>
      </div>
      <div className="avatar-selector">
        {AVATARS.map((image) => (
          <img
            key={image}
            alt={image}
            height={64}
            width={64}
            className={avatar === image ? "selected" : ""}
            src={require(`../../assets/avatars/${image}.png`).default}
            onClick={(e) => handleSelectAvatar(e, image)}
            onKeyDown={(e) => e.key === "Enter" && handleSelectAvatar(e, image)}
            tabIndex={0}
          />
        ))}
      </div>
    </>
  );
}

export default LoginForm;
