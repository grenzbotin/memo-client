import Navbar from "../components/Navbar";
import NewRequest from "../components/NewRequest";
import PlayersList from "../components/PlayersList";

function Lobby() {
  return (
    <>
      <Navbar />
      <PlayersList />
      <NewRequest />
    </>
  );
}

export default Lobby;
