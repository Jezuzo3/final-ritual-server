const userService = require('../src/services/userService');
const server = require('../index');
const io = server.socketIO;
const { NEW_CONNECTION , DISCONNECT, UPDATE_ONCRYPT,INVOKE_CIRCLE} = require('../src/constants');

events = (socket) => {
  
    console.log({ Clientsocket: socket.id });

    socket.on(NEW_CONNECTION, async (data) => {
      try {
        data.body = {
          idSocket: socket.id
        }

        const updatedUser = await userService.updateUserByEmail(
          data.email,
          data.body
        )
      } catch (error) {
        throw error;
      }
    });

    socket.on(UPDATE_ONCRYPT, async (data) => {
      try {
        data.body = {
          onCrypt: true
        }
        const updatedUser = await userService.updateUserByEmail(
          data.email,
          data.body
        );

        const idSockets = [socket.id, updatedUser.idSocket];
        const villainIdSocket = await userService.getIdSocketByRol("villain");
        const mortimerIdSocket = await userService.getIdSocketByRol("mortimer");
        idSockets.push(villainIdSocket, mortimerIdSocket);
        
        io.to(idSockets).emit(UPDATE_ONCRYPT, updatedUser);
      } catch (error) {
        throw error;
      }
    });
  
    socket.on(DISCONNECT, async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        const changes = {
          onCrypt: false,
          idSocket: null
        };

        const updatedUser = await userService.updateUserByIdSocket(
          socket.id,
          changes
        )
      } catch (error) {
        throw error;
      }
    });

    //Socket emmit invocar circulo
    socket.on(INVOKE_CIRCLE, async () => {
      try {
        io.emmit(INVOKE_CIRCLE, {missionStatus:"INVOKE_CIRCLE"});
      } catch (error) {
        throw error;
      }
    });
  
  }
  
  exports.socketEvents = events;