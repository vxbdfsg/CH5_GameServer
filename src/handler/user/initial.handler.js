import { addUser } from '../../sessions/user.session.js';
import { getGameSession } from '../../sessions/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';
import User from '../../classes/models/user.class.js';

const initialHandler = async (socket, userId, payload) => {
    try {
        const { deviceId, latency, playerId } = payload;
        const coords = { x: 0, y: 0 };

        let user = await findUserByDeviceID(deviceId);
        if (!user) {
            await createUser(deviceId);
        } else {
            await updateUserLogin(deviceId);
            coords.x = user.xCoord;
            coords.y = user.yCoord;
        }

        user = new User(socket, deviceId, playerId, latency, coords);
        addUser(user);
        const gameSession = getGameSession();
        gameSession.addUser(user);

        const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
            userId: deviceId,
            x: user.x,
            y: user.y,
        });

        socket.write(initialResponse);
    } catch (e) {
        console.error(e);
    }
};

export default initialHandler;
