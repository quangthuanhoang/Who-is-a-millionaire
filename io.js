const genQuestion = require("./question");
const events = require("events");
const eventEmitter = new events.EventEmitter();
let roomCreatedNotStart = [];
let roomActives = [];
const currentRoomQuestions = {};

const MAX_Q = 5;
const MAX_TIME = 15000;

function handle(io) {
  eventEmitter.on("nextQuestion", ({ roomId, indexQuestion }) => {

    if(roomId && (indexQuestion < MAX_Q)) {
        const index = roomActives.findIndex((object) => {
            return object.roomId === roomId;
          });
         roomActives[index].user1.answered = 0;
         roomActives[index].user2.answered = 0;
        const current = currentRoomQuestions[roomId];
        const { questions, currentIndex } = current;
        if (current.timeout) {
        clearTimeout(current.timeout);
    }
    const timeout = setTimeout(() => {
      currentRoomQuestions[roomId].currentIndex += 1;
      eventEmitter.emit("nextQuestion", {roomId, indexQuestion: +indexQuestion + 1});
    }, MAX_TIME);
    current.timeout = timeout;

    if (current.max <= MAX_Q) {
      io.to(roomId).emit("question", {
        question: questions[currentIndex],
        currentIndex,
        time: 15,
        roomId,
        user1: roomActives[index].user1,
        user2: roomActives[index].user2,
      });
    }
    }
    else {
        const index = roomActives.findIndex((object) => {
            return object.roomId === roomId;
          });
        io.to(roomId).emit("end", {
            notify: "Kết thúc rồi",
            user1: roomActives[index].user1,
            user2: roomActives[index].user2,
          });
    }
  });
}

function listen(io) {
  handle(io);
  io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected!`);
    let roomCode = undefined;
    // 1. Tạo phòng chơi
    socket.on("CREATEROOM", (data) => {
      const max = 1000;
      const min = 1;
      roomCode = `${Math.floor(Math.random() * (max - min + 1) + min)}`;
      socket.emit("200", {
        title: "Bạn đã yêu cầu tạo phòng thành công",
        roomCode,
      });
      roomCreatedNotStart.push({
        roomId: roomCode,
        user1: { id: socket.id, score: 0, answered: 0 },
      });
      socket.join(roomCode);
      socket.emit("210", { message: "Bạn đã tham gia vào phòng", roomCode });
    });

    // 2. Vào phòng chơi
    socket.on("JOINROOM", (roomId) => {
      const index = roomCreatedNotStart.findIndex((object) => {
        return object.roomId === roomId;
      });
      const element = roomCreatedNotStart.splice(index, 1)[0];
      element.user2 = { id: socket.id, score: 0, answered: 0 };
      roomActives.push(element);
      socket.join(roomId);
      socket.emit("210", "Bạn đã tham gia vào phòng");
      io.to(roomId).emit("215", { message: "Đã có 2 người chơi", roomId });
    });
    // 3. Bắt đầu trò chơi
    socket.on("STARTGAME", (roomId) => {
        if(io.sockets.adapter.rooms.get(roomId)) {
            const index = roomActives.findIndex((object) => {
                return object.roomId === roomId;
              });
        
              io.to(roomId).emit("233", {
                title: "Trò chơi bắt đầu rồi",
                check: true,
                roomId,
                user1: roomActives[index].user1,
                user2: roomActives[index].user2,
              });
              let questions = genQuestion(MAX_Q);
              console.log('questions', questions);
              for (const index in questions) {
                questions[index] = { ...questions[index], index };
              }
              if (!currentRoomQuestions[roomId]) {
                currentRoomQuestions[roomId] = {
                  questions,
                  currentIndex: 0,
                  max: MAX_Q - 1,
                };
              }
              eventEmitter.emit("nextQuestion", { roomId, indexQuestion: 0 });
        } else {
           socket.emit("239", {
                notify: "Chưa đủ người chơi",
                roomId
              });
        }

    });

    // 4. Nhận câu trả lời của client
    socket.on("ANSWER", ({ roomId, userAnswer, indexQuestion }) => {
            const current = currentRoomQuestions[roomId];
            const currentQuesion = current.questions[current.currentIndex];
      
            const index = roomActives.findIndex((object) => {
              return object.roomId === roomId;
            });
           if(indexQuestion < MAX_Q - 1) {
              if (roomActives[index].user1.id === socket.id) {
                  console.log("user11111", socket.id);
                 if(!roomActives[index].user1.answered) {
                    if (currentQuesion.correct === Number(userAnswer)) {
                        roomActives[index].user1.score += 10;
              
                        currentRoomQuestions[roomId].currentIndex += 1;
                        eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                      } else if (currentQuesion.correct !== Number(userAnswer)) {
                        roomActives[index].user1.score -= 5;
                        roomActives[index].user1.answered += 1;
                        console.log('user1', roomActives[index].user1);
                        console.log('user2', roomActives[index].user2);
                      io.to(roomId).emit("230", {
                          roomId,
                          user1: roomActives[index].user1,
                          user2: roomActives[index].user2,
                      });
                      }
                 }
                  if( roomActives[index].user1.answered ===  roomActives[index].user2.answered){
                    currentRoomQuestions[roomId].currentIndex += 1;
                    eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                  }
                } else if (roomActives[index].user2.id === socket.id && !roomActives[index].user2.answered) {
                  console.log("user2222", socket.id);
                if(!roomActives[index].user2.answered) {
                    if (currentQuesion.correct === Number(userAnswer)) {
                        roomActives[index].user2.score += 10;
                        currentRoomQuestions[roomId].currentIndex += 1;
                        eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                      } else if (currentQuesion.correct !== Number(userAnswer)) {
                        roomActives[index].user2.score -= 5;
                        roomActives[index].user2.answered += 1;
                        console.log('user1', roomActives[index].user1);
                        console.log('user2', roomActives[index].user2);
                        io.to(roomId).emit("230", {
                          roomId,
                          user1: roomActives[index].user1,
                          user2: roomActives[index].user2,
                      });
                      }
                }
                  if( roomActives[index].user1.answered ===  roomActives[index].user2.answered){
                    currentRoomQuestions[roomId].currentIndex += 1;
                    eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                  }
                }
           }
           else {
              if (roomActives[index].user1.id === socket.id) {
                  console.log("user11111", socket.id);
                  if (currentQuesion.correct === Number(userAnswer)) {
                    roomActives[index].user1.score += 10;
          
                    io.to(roomId).emit("end", {
                      notify: "Kết thúc rồi",
                      user1: roomActives[index].user1,
                      user2: roomActives[index].user2,
                    });
                  } else if (currentQuesion.correct !== Number(userAnswer)) {
                    roomActives[index].user1.score -= 5;
          
                    io.to(roomId).emit("end", {
                      notify: "Kết thúc rồi",
                      user1: roomActives[index].user1,
                      user2: roomActives[index].user2,
                    });
                  }
                } else if (roomActives[index].user2.id === socket.id) {
                  console.log("user2222", socket.id);
                  if (currentQuesion.correct === Number(userAnswer)) {
                    roomActives[index].user2.score += 10;
                    io.to(roomId).emit("end", {
                      notify: "Kết thúc rồi",
                      user1: roomActives[index].user1,
                      user2: roomActives[index].user2,
                    });
                  } else if (currentQuesion.correct !== Number(userAnswer)) {
                    roomActives[index].user2.score -= 5;
          
                    io.to(roomId).emit("end", {
                      notify: "Kết thúc rồi",
                      user1: roomActives[index].user1,
                      user2: roomActives[index].user2,
                    });
                  }
                }
           }
     
    });
    // 5. Người chơi thoát phòng
    socket.on("EXITROOM ", () => {
      console.log("Client exit room");
    });

  });
}

module.exports = listen;