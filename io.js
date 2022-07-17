const genQuestion = require("./question")
const events = require("events")
const eventEmitter = new events.EventEmitter()
let roomCreatedNotStart = []
let roomsActive = []
const currentRoomQuestions = {}

const MAX_Q = 6
const MAX_TIME = 5000

function handle(io) {
    eventEmitter.on("nextQuestion", roomId => {
        const current = currentRoomQuestions[roomId]
        const {questions, currentIndex} = current
        if (current.timeout) {
            clearTimeout(current.timeout)
        }
        const timeout = setTimeout(() => {
            currentRoomQuestions[roomId].currentIndex += 1
            eventEmitter.emit("nextQuestion", roomId)
        }, MAX_TIME)
        current.timeout = timeout
        if (current.max > MAX_Q) {
            current.completed = 1
            io.to(roomId).emit('endd', {
                //Todo: Score
                score: 10000
            });
        }
        else {
            io.to(roomId).emit('question', {
                question: questions[currentIndex],
                currentIndex
            });
        }
    })
}

function listen(io) {
    handle(io)
    io.on('connection', (socket) => {
            console.log(`Client ${socket.id} connected!`);
            let roomCode = undefined
            // 1. Tạo phòng chơi
            socket.on('CREATEROOM', data => {
                const max = 100
                const min = 10
                roomCode = 'ROOM' + Math.floor(Math.random() * (max - min + 1) + min)
                socket.emit("200", {title: 'Bạn đã yêu cầu tạo phòng thành công', roomCode})
                roomCreatedNotStart.push({roomID: roomCode, clientOwner: socket.id})
                socket.join(roomCode);
                console.log("roomCode", roomCode)
                socket.emit("210", "Bạn đã tham gia vào phòng");
            })

            // 2. Vào phòng chơi
            socket.on("JOINROOM", (roomId) => {
                const a = roomCreatedNotStart.find(room => room.roomID === roomId)
                roomsActive.push({...a, clientOther: socket.id})
                console.log('Lấy được phòng chơi ra rồi: ', roomsActive)
                socket.join(roomId)
                socket.emit("210", "Bạn đã tham gia vào phòng");
                socket.to(roomId).emit("211", {title: 'Bạn đã yêu cầu tạo phòng thành công', check: true})
            })
            // 3. Bắt đầu trò chơi
            socket.on('STARTGAME', (roomId) => {
                socket.to(roomId).emit("233", {title: 'Trò chơi bắt đầu rồi', check: true, roomId})
                const questions = genQuestion(MAX_Q)
                if (!currentRoomQuestions[roomId]) {
                    currentRoomQuestions[roomId] = {
                        questions,
                        currentIndex: 0,
                        max: MAX_Q - 1
                    }
                }
                eventEmitter.emit("nextQuestion", roomId)
                // console.log(i, timer
            })


            // 4. Nhận câu trả lời của client
            socket.on('ANSWER', ({roomId, userAnswer}) => {
                console.log("ANSWER", roomId, userAnswer)
                const current=currentRoomQuestions[roomId]
                const currentQuesion = current.questions[current.currentIndex]
                let checkAnswer = -1
                if (currentQuesion.correct === Number(userAnswer)) {
                    socket.emit('230', 1)
                    if (currentQuesion.correct === Number(userAnswer)) {
                        checkAnswer = 1
                    }
                } else {
                    socket.emit('230', 0)
                    checkAnswer = 0
                }
                console.log('Chuwa ra day a', checkAnswer)
                if (checkAnswer === 1) {
                    console.log('Đã khớp rồi')
                    currentRoomQuestions[roomId].currentIndex += 1
                    eventEmitter.emit("nextQuestion", roomId)
                }
            })
            // 5. Người chơi thoát phòng
            socket.on('EXITROOM ', () => {
                console.log('Client exit room')
            })
        }
    )
}

module.exports = listen