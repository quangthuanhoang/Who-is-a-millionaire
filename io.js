const genQuestion = require("./question")
const {v4: uuid} = require("uuid")
const rooms = {}// phòng đang chơi
const roomCreated = []// phong tạo nhưng chưa đủ 2 người chơi
let userPendings = []

function getRoomKey(user1, user2) {
    if (user1 > user2) {
        return `${user1}$$${user2}`
    }
    return `${user2}-${user1}`
}

const TIME_DELAY_START = 3000
const TIME_PER_QUESTION = 3000
module.exports = function listen(io) {
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        // const q=genQuestion(1)
        // socket.send(q)
        socket.on("goQueue", data => {
            if (!userPendings.includes(socket.id)) {
                userPendings.push(socket.id)
                socket.emit("msg", "Đang tìm kiếm phòng")
            } else {
                socket.emit("msg", "Đã ở trong queue rồi")
            }
        })
        socket.on("createRoom", data => {
            if(!userPendings.length) {
                socket.emit("msg", 'Không có người chơi nào trong phòng đợi')
            }
            else if (!userPendings.includes(socket.id)) {
                userPendings = userPendings.filter(i => i !== socket.id)
                roomCreated.push({
                    create: socket.id
                })
            }
        })
        socket.on("disconnect", () => {
            for (let key in rooms) {
                if (key.includes(socket.id)) {
                    const user = key.replace(socket.id, '').replace("$$", "")
                    const userSocket = io.sockets.sockets.get(user);
                    console.log("left", socket.id, "user", user)
                    if (userSocket) {
                        userSocket.emit("msg", "Đối thủ đã thoát rồi nhé")
                    }
                    // TODO:Sẽ xử lý tiếp ở đây
                }
            }
        })

    });

    function startGame(room) {
        const {create, partner} = room
        const partnerSocket = io.sockets.sockets.get(partner);
        const userSocket = io.sockets.sockets.get(create);
    }

    setInterval(() => {
        if (userPendings.length && roomCreated.length) {
            const roomCreate = roomCreated.shift()
            const userMatch = userPendings.shift()
            const user1 = roomCreate.create
            const key = getRoomKey(user1, userMatch)
            const room = {
                create: user1,
                partner: userMatch,
                isConnect: 1,
                roomId: key,
                currentQuestion: 0,
                partnerScore: 0,
                createScore: 0
            }
            rooms[key] = room
            const partnerSocket = io.sockets.sockets.get(userMatch);
            const userSocket = io.sockets.sockets.get(user1);
            partnerSocket.join(key)
            userSocket.join(key)
            userSocket.emit("msg", "Kết nối với đối thủ tên ...")
            partnerSocket.emit("msg", "Kết nối với đối thủ tên ...")
            io.sockets.in(key).emit('msg', "Kết nối với đối thủ thành công");
            io.sockets.in(key).emit('startGame', {
                startIn: TIME_DELAY_START
            });
            setTimeout(() => {
                for (let i = 1; i < 6; i++) {
                    setTimeout(() => {
                        io.sockets.in(key).emit('question', {
                            question: genQuestion(i)
                        });
                    }, (i - 1) * TIME_PER_QUESTION)
                }
            }, TIME_DELAY_START)
            startGame(room)
            console.log("hi")
        }
    }, 2000)
}
