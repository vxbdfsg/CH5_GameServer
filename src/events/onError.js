import { getGameSession } from "../sessions/game.session.js";
import { removeUser } from "../sessions/user.session.js";

export const onError = (socket) => async (error) => {
    await removeUser(socket);

    const gameSession = getGameSession();
    gameSession.removeUser(socket);
}