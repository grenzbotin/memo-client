import { useContext } from "react";

import { useAppSelector } from "../../store";
import { WebSocketContext } from "../WebsocketContext";
import Modal from "../Modal";
import { useFavicon } from "../../hooks/useFavicon";

function NewRequest() {
  const { requests, inviteSend } = useAppSelector(
    (state) => state.gamesReducer
  );
  const { cancelGameRequest, acceptGameRequest } = useContext(WebSocketContext);
  useFavicon(requests.length);

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
      <Modal
        id="requestModal"
        modalHeadPicture={
          <img
            alt={requests[0].invited_by}
            height={64}
            width={64}
            src={
              require(`../../assets/avatars/${requests[0].invited_by_avatar}.png`)
                .default
            }
          />
        }
        modalContent={
          <>
            <b>{requests[0].invited_by}</b> invited you to a new game!
          </>
        }
        modalActions={{
          secondary: {
            action: (e) => handleCancelGameRequest(e, requests[0].gameId),
            text: "Sorry :/",
          },
          primary: {
            action: (e) => handleAcceptGameRequest(e, requests[0].gameId),
            text: "Let's play",
          },
        }}
      />
    )
  );
}

export default NewRequest;
