
export const SocketSever = (socket) => {
    socket.on('joinRoom', (idpost) =>{
        socket.join(idpost)
    })
    socket.on('online', function (data) {    
        if(data.iduser !== undefined){
            socket.join(data.iduser);
            console.log({online: (socket).adapter.rooms})
        }
      });

    socket.on('offline', (data) =>{
        socket.leave(data.iduser)
        console.log({offline: (socket).adapter.rooms})
    })

    socket.on('outRoom', (idpost) =>{
        socket.leave(idpost)
        // console.log({outRoom: (socket).adapter.rooms})
    })

    socket.on('disconnect', () => {
        console.log(socket.id + " disconnected")


    })
}