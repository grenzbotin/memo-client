import { useContext } from "react";

import "./NewRequest.scss";
import { useAppSelector } from "../../store";
import { WebSocketContext } from "../WebsocketContext";

function NewRequest() {
  const { requests, inviteSend } = useAppSelector(
    (state) => state.gamesReducer
  );
  const { cancelGameRequest, acceptGameRequest } = useContext(WebSocketContext);

  if (!requests.length) return null;

  const handleCancelGameRequest = (
    e: React.MouseEvent<HTMLElement>,
    gameId: string
  ) => {
    e.stopPropagation();
    cancelGameRequest(gameId);
  };

  const handleAcceptGameRequest = (
    e: React.MouseEvent<HTMLElement>,
    gameId: string
  ) => {
    e.stopPropagation();
    // if user had an invite sent himself to another user, this needs to be cancelled
    if (inviteSend?.gameId) {
      cancelGameRequest(inviteSend?.gameId);
    }

    // send a cancel request for all other invitations ids
    requests
      .filter((request) => request.gameId !== gameId)
      .forEach((request) => cancelGameRequest(request.gameId));

    acceptGameRequest(gameId);
  };

  return (
    requests[0] && (
      <div id="requestModal" className="modal">
        <div className="modal-box">
          <img
            alt={requests[0].invited_by}
            height={64}
            width={64}
            src={
              require(`../../assets/avatars/${requests[0].invited_by_avatar}.png`)
                .default
            }
          />
          <div className="modal-inner">
            <div className="modal-content">
              <div>
                <b>{requests[0].invited_by}</b> invited you to a new game!
              </div>

              <div className="modal-actions">
                <button
                  className="secondary"
                  onClick={(e) =>
                    handleCancelGameRequest(e, requests[0].gameId)
                  }
                >
                  Sorry :/
                </button>
                <button
                  onClick={(e) =>
                    handleAcceptGameRequest(e, requests[0].gameId)
                  }
                >
                  Let's play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default NewRequest;
