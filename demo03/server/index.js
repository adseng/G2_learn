// const { Server } = require('socket.io')
import {Server} from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: '*'
    }
})

// 用于存储连接的客户端
const clients = {};

const tankConfig = {
    stepSize: 0.01,
    stepSpeed: 1
}

const room1 = 'room1'

io.on('connect', socket => {

    socket.once('init', args => {
        // 为新连接的客户端创建一个坦克
        clients[socket.id] = {
            id: socket.id,
            tankStatus: args
        };

        socket.join(room1)
        io.to(room1).emit('updateTanks', clients)
    })

    socket.on('disconnect', () => {
        delete clients[socket.id]
        socket.to(room1).emit('updateTanks', clients)
    })

    socket.on('moveTank', args => {
        console.log('moveTank',args)
        for (let i = 0; i < tankConfig.stepSpeed; i++) {

            let x = clients[socket.id].tankStatus.x
            let y = clients[socket.id].tankStatus.y
            if ('ArrowLeft' === args) {
                x = x - tankConfig.stepSize
            }
            if ('ArrowRight' === args) {
                x = x + tankConfig.stepSize
            }
            if ('ArrowUp' === args) {
                y = y - tankConfig.stepSize
            }
            if ('ArrowDown' === args) {
                y = y + tankConfig.stepSize
            }

            clients[socket.id].tankStatus.x = x
            clients[socket.id].tankStatus.y = y
            io.to(room1).emit('updateTanks', clients)
        }

    })
})
