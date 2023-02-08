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

  // Listener para actualizar estado onCrypt
  socket.on(constants.UPDATE_ONCRYPT, async (data) => {
    try {
      data.body = {
        userState: "onCrypt",
      };
      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );

      const idSockets = [socket.id, updatedUser.idSocket];
      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
      idSockets.push(villainIdSocket, mortimerIdSocket);

      io.to(idSockets).emit(constants.UPDATE_ONCRYPT, updatedUser);
    } catch (error) {
      throw error;
    }
  });

  // Listener para invocar circulo
  socket.on(constants.INVOKE_CIRCLE, async () => {
    try {
      const data = {
        missionStatus: constants.INVOKE_CIRCLE,
      };
      io.emit(constants.INVOKE_CIRCLE, data);
    } catch (error) {
      throw error;
    }
  });

  // Listener para iniciar el rito
  socket.on(constants.START_RITE, async () => {
    try {
      const data = {
        missionStatus: constants.START_RITE,
      };
      io.emit(constants.START_RITE, data);
    } catch (error) {
      throw error;
    }
  });

  // Listener para empezar la lectura arcana
  socket.on(constants.ARCANE_READING, async () => {
    try {
      const data = {
        missionStatus: constants.ARCANE_READING,
      };
      io.emit(constants.ARCANE_READING, data);
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
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
      const idSockets = [socket.id, acolyte.idSocket, mortimerIdSocket];

      io.to(idSockets).emit(constants.VILLAIN_SABOTAGE, acolyte);
    } catch (error) {
      throw error;
    }
  });

  // Listener para lanzar división espectral
  socket.on(constants.LAUNCH_SPECTRAL_DIVISION, async () => {
    try {
      const data = {
        missionStatus: constants.LAUNCH_SPECTRAL_DIVISION,
      };
      io.emit(constants.LAUNCH_SPECTRAL_DIVISION, data);
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
      io.emit(constants.MORTIFYING_ATTACK, res);

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

  // Listener para aceptar ritual
  socket.on(constants.ACCEPT_ACOLYTE_RITUAL, async (data) => {
    try {
      data.body = {
        userState: "onRitual",
      };
      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );
      const idSockets = [updatedUser.idSocket];
      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
      idSockets.push(villainIdSocket, mortimerIdSocket);

      io.to(idSockets).emit(constants.ACCEPT_ACOLYTE_RITUAL, updatedUser);
    } catch (error) {
      throw error;
    }
  });

  // Listener para inicial plegaria el acólito
  socket.on(constants.START_ACOLYTE_PRAYER, async (data) => {
    try {
      data.body = {
        userState: "praying",
      };
      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );
      const idSockets = [updatedUser.idSocket];
      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
      idSockets.push(villainIdSocket, mortimerIdSocket);

      io.to(idSockets).emit(constants.START_ACOLYTE_PRAYER, updatedUser);
    } catch (error) {
      throw error;
    }
  });

  // Listener para actualizar el estado del acólito a ready
  socket.on(constants.ACOLYTE_READY, async (data) => {
    try {
      data.body = {
        userState: "ready",
      };
      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );
      const idSockets = [updatedUser.idSocket];
      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
      idSockets.push(villainIdSocket, mortimerIdSocket);

      io.to(idSockets).emit(constants.ACOLYTE_READY, updatedUser);
    } catch (error) {
      throw error;
    }
  });

  // Listener para que el acólito lanze la división espectral
  socket.on(constants.ACOLYTE_BUTTON_SPECTRAL_DIVISION, async (data) => {
    try {
      data.body = {
        userState: "launched",
      };
      const updatedUser = await userService.updateUserByEmail(
        data.email,
        data.body
      );
      const idSockets = [updatedUser.idSocket];
      const villainIdSocket = await userService.getIdSocketByRol("villain");
      const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
      idSockets.push(villainIdSocket, mortimerIdSocket);

      io.to(idSockets).emit(
        constants.ACOLYTE_BUTTON_SPECTRAL_DIVISION,
        updatedUser
      );
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

  // Listener para enseñar la pantalla final
  socket.on(constants.FINAL_SCREEN, async () => {
    try {
      const data = {
        missionStatus: constants.FINAL_SCREEN,
      };
      io.emit(constants.FINAL_SCREEN, data);
    } catch (error) {
      throw error;
    }
  });

  // Listener para reiniciar la aventura
  socket.on(constants.RESTART_RITUAL, async () => {
    try {
      const data = {
        missionStatus: null,
      };
      io.emit(constants.RESTART_RITUAL, data);
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
