events = (socket) => {
  
    console.log({ Clientsocket: socket.id });
    socket.emit("new_user", socket.id);
  
    
    // TEST BROADCAST
    socket.on('test_broadcast', async (data) => {
      try {
        socket.broadcast.emit('test_broadcast', data);
      } catch (error) {
        console.log(error);
        socket.emit('test_broadcastError', error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected: ', socket.id);      
    });
  
  }
  
  exports.socketEvents = events;