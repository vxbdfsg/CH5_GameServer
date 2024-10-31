import { getGameSession } from '../../sessions/game.session.js';

const locationUpdateHandler = (socket, userId, payload) => {
    try {
        const { x, y } = payload;
        const gameSession = getGameSession();

        if (!gameSession) {
            console.error('Game session nor found');
        }

        //console.log(gameSession);

        const user = gameSession.getUser(userId);
        console.log('유저 아이디 : ', userId);
        if (!user) {
            console.error('User not found');
        }

        user.updatePosition(x, y);

        const locationData = gameSession.getAllLocation(userId);
        console.log("로케이션 데이타 : ", locationData)

        socket.write(locationData);
    } catch (e) {
        console.error(e);
    }
};

export default locationUpdateHandler;
