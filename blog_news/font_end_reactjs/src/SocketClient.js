import React, { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux'
import {createCmt} from './redux/features/comments/commentSlice'

function SocketClient() {

    const socket = useSelector((state) => state.socket.socket);
    const { dataUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        if(!socket) return;
        if(!dataUser) return;
        socket.emit('online', {iduser: dataUser._id });
        socket.on('createComment', (data) => {
            dispatch(createCmt(data))
        })

        return () => {
            socket.off('createComment')
            socket.emit("offline", {iduser: dataUser._id })
        }
    }, [socket, dispatch,dataUser])

    return (
        <div>
            
        </div>
    );
}

export default SocketClient;