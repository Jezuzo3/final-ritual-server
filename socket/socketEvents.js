const userService = require("../src/services/userService");
const server = require("../index");
const io = server.socketIO;
const constants = require("../src/constants");
const { calcBattle } = require("../src/helpers/mortifyingBattle");

events = (socket) => {
  console.log({ Clientsocket: socket.id });

  socket.on(constants.NEW_CONNECTION, async (data) => {
    try {
      data.body = {
        idSocket: socket.id,
      };

      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );
    } catch (error) {
      throw error;
    }
  });

  // Listener para cambiar el estado de la misión
  socket.on(constants.CHANGE_MISSION_STATUS, async (data) => {
    try {
      io.emit(constants.CHANGE_MISSION_STATUS, data);
    } catch (error) {
      throw error;
    }
  });

  // Listener para cambiar el estado del usuario
  socket.on(constants.CHANGE_USER_STATUS, async (data) => {
    try {
      data.body = {
        userState: data.userState,
      };
      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );

      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");

      const idSockets = [...villainIdSocket, ...mortimerIdSocket];
      idSockets.push(updatedUser.idSocket);

      io.to(idSockets).emit(constants.CHANGE_USER_STATUS, updatedUser);
    } catch (error) {
      throw error;
    }
  });

  // Listener para aplicar el sabotaje del villano en un acólito
  socket.on(constants.VILLAIN_SABOTAGE, async () => {
    try {
      const acolytes = await userService.getAcolytes();
      const randNumber = Math.floor(Math.random() * acolytes.length);
      const acolyte = acolytes[randNumber];

      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");

      const idSockets = [...villainIdSocket, ...mortimerIdSocket];
      idSockets.push(acolyte.idSocket);

      io.to(idSockets).emit(constants.VILLAIN_SABOTAGE, acolyte);
    } catch (error) {
      throw error;
    }
  });

  // Listener para manejar el ataque del villano a mortimer
  socket.on(constants.MORTIFYING_ATTACK, async (data) => {
    try {
      const res = {
        missionStatus: constants.MORTIFYING_ATTACK,
      };
      io.emit(constants.CHANGE_MISSION_STATUS, res);

      let finished = false;
      let counter = 1;
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(5000);
      do {
        const battle = calcBattle();
        const difference = battle[0].attackValue - battle[1].attackValue;
        if (difference >= 50) {
          finished = true;
          const message = `Round ${counter}: The villain wins and fucks up the summoning`;
          console.log(message);
          const resObj = {
            missionStatus: "villain_wins",
            message,
          };
          io.emit(constants.FINAL_BATTLE_RESULT, resObj);
        } else if (difference <= -50) {
          finished = true;
          const message = `Round ${counter}: Morimer wins! FATALITY!!!`;
          console.log(message);
          const resObj = {
            missionStatus: data.missionStatus,
            message,
          };
          io.emit(constants.FINAL_BATTLE_RESULT, resObj);
        } else {
          const message = `Round ${counter}: The villain scores a power level of ${battle[0].attackValue} and Mortimer counterattacks with a power level of ${battle[1].attackValue}`;
          console.log(message);
          io.emit(constants.MORTIFYING_BATTLE, message);
          counter++;
          await delay(5000);
        }
      } while (!finished);
    } catch (error) {
      throw error;
    }
  });

  // Listener para enviar el progreso de la barra
  socket.on(constants.ACOLYTE_PROGRESS, async (data) => {
    try {
      const villainIdSocket = await userService.getIdSocketByRol("villain");
      io.to(villainIdSocket).emit(constants.ACOLYTE_PROGRESS, data);
    } catch (error) {
      throw error;
    }
  });

  socket.on(constants.DISCONNECT, async () => {
    console.log(`Client disconnected: ${socket.id}`);
    try {
      const changes = {
        userState: null,
        idSocket: null,
      };

      const updatedUser = await userService.updateUserByIdSocket(
        socket.id,
        changes
      );
    } catch (error) {
      throw error;
    }
  });
};

exports.socketEvents = events;
