const genQuestion = require("./question");
const events = require("events");
const eventEmitter = new events.EventEmitter();
let roomCreatedNotStart = [];
let roomActives = [];
const currentRoomQuestions = {};

const MAX_Q = 5;
const MAX_TIME = 1500000;

function handle(io) {
  eventEmitter.on("nextQuestion", ({ roomId, indexQuestion }) => {

    if(roomId && (indexQuestion < MAX_Q)) {
        const index = roomActives.findIndex((object) => {
            return object.roomId === roomId;
          });
          if( roomActives[index].user1.answered) {
            roomActives[index].user1.answered = 0;
        }
        if( roomActives[index].user2.answered) {
            roomActives[index].user2.answered = 0;
        }
        const current = currentRoomQuestions[roomId];
        const { questions, currentIndex } = current;
        if (current.timeout) {
        clearTimeout(current.timeout);
    }
    const timeout = setTimeout(() => {
      currentRoomQuestions[roomId].currentIndex += 1;
      eventEmitter.emit("nextQuestion", {roomId, indexQuestion: +indexQuestion + 1});
      if(roomActives[index].user1.answered === 0 && roomActives[index].user2.answered === 0 && indexQuestion === MAX_Q - 1) {
        const index = roomActives.findIndex((object) => {
            return object.roomId === roomId;
          });
      if(index !== -1) {
        io.to(roomId).emit("end", {
            notify: "Kết thúc rồi",
            user1: roomActives[index].user1,
            user2: roomActives[index].user2,
          });
      }
    }
    }, MAX_TIME);
    current.timeout = timeout;

    io.to(roomId).emit("question", {
        question: questions[currentIndex],
        currentIndex,
        time: 1500,
        roomId,
        user1: roomActives[index].user1,
        user2: roomActives[index].user2,
      });
    }
  });
}

function listen(io) {
  handle(io);
  io.on("connection", (socket) => {
    let roomCode = undefined;
 
    // 1. Tạo phòng chơi
    socket.on("CREATEROOM", (name) => {
      const max = 1000;
      const min = 1;
      roomCode = `${Math.floor(Math.random() * (max - min + 1) + min)}`;
      socket.emit("200", {
        title: "Bạn đã yêu cầu tạo phòng thành công",
        roomCode,
      });
      const user1 =  { id: socket.id, score: 0, answered: 0, name }
      roomCreatedNotStart.push({
        roomId: roomCode,
        user1,
      });
      socket.join(roomCode);
      socket.emit("210", { message: "Bạn đã tham gia vào phòng", roomId: roomCode, user1 });
    });

    // 2. Vào phòng chơi
    socket.on("JOINROOM", ({roomId, name}) => {
     if(io.sockets.adapter.rooms.get(roomId).size  < 2) {
        const index = roomCreatedNotStart.findIndex((object) => {
            return object.roomId === roomId;
          });
         if(index !== -1) {
            const element = roomCreatedNotStart.splice(index, 1)[0];
            element.user2 = { id: socket.id, score: 0, answered: 0, name };
            roomActives.push(element);
            socket.join(roomId);
            io.to(roomId).emit("215", { message: "Đã có 2 người chơi", roomId, user2: element.user2, user1: element.user1 });
     }
     else {
        io.to(roomId).emit("777", { message: "Phòng đã đầy", roomId});
     }
     }
    });
    // 3. Bắt đầu trò chơi
    socket.on("STARTGAME", (roomId) => {
        if(io.sockets.adapter.rooms.get(roomId).size === 2) {
            const index = roomActives.findIndex((object) => {
                return object.roomId === roomId;
              });
             if(index !== -1) {
                console.log('Vẫn vào đây');
                io.to(roomId).emit("233", {
                    title: "Trò chơi bắt đầu rồi",
                    check: true,
                    roomId,
                    user1: roomActives[index].user1,
                    user2: roomActives[index].user2,
                  });
             }
              let questions = genQuestion(MAX_Q);
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
           if(indexQuestion < MAX_Q) {
              if (roomActives[index].user1.id === socket.id) {
                 if(roomActives[index].user1.answered === 0) {
                    if (currentQuesion.correct === Number(userAnswer)) {
                        roomActives[index].user1.score += 10;
                        roomActives[index].user1.answered += 1
                        currentRoomQuestions[roomId].currentIndex += 1;
                        eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                      } else {
                        roomActives[index].user1.score -= 0;
                        roomActives[index].user1.answered += 1
                        socket.emit("230", {
                          roomId,
                          user1: roomActives[index].user1,
                          user2: roomActives[index].user2,
                          answer: currentRoomQuestions[roomId].questions[indexQuestion - 1].correct
                      });
                      }
                 }
                   if( roomActives[index].user1.answered && roomActives[index].user2.answered){
                    currentRoomQuestions[roomId].currentIndex += 1;
                    eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                  }
                } else if (roomActives[index].user2.id === socket.id) {
                if(roomActives[index].user2.answered === 0) {
                    if (currentQuesion.correct === Number(userAnswer)) {
                        roomActives[index].user2.score += 10;
                        roomActives[index].user2.answered += 1
                        currentRoomQuestions[roomId].currentIndex += 1;
                        eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                      } else {
                        roomActives[index].user2.score -= 0;
                        roomActives[index].user2.answered += 1
                        socket.emit("230", {
                          roomId,
                          user1: roomActives[index].user1,
                          user2: roomActives[index].user2,
                          answer: currentRoomQuestions[roomId].questions[indexQuestion - 1].correct
                      });
                      }
                }
        
                if( roomActives[index].user1.answered &&  roomActives[index].user2.answered){
                    currentRoomQuestions[roomId].currentIndex += 1;
                    eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
                  }
                }
           }
           else {
            if (roomActives[index].user1.id === socket.id) {
                if(roomActives[index].user1.answered === 0) {
                   if (currentQuesion.correct === Number(userAnswer)) {
                       roomActives[index].user1.score += 10;
                       roomActives[index].user1.answered += 1
                       io.to(roomId).emit("end", {
                        notify: "Kết thúc rồi",
                        user1: roomActives[index].user1,
                        user2: roomActives[index].user2,
                      });
                     } else {
                       roomActives[index].user1.score -= 0;
                       roomActives[index].user1.answered += 1
                        socket.emit("230", {
                         roomId,
                         user1: roomActives[index].user1,
                         user2: roomActives[index].user2,
                         answer: currentRoomQuestions[roomId].questions[indexQuestion - 1].correct
                     });
                     }
                }
                  if( roomActives[index].user1.answered && roomActives[index].user2.answered){
                   io.to(roomId).emit("end", {
                    notify: "Kết thúc rồi",
                    user1: roomActives[index].user1,
                    user2: roomActives[index].user2,
                  });
                 }
               } else if (roomActives[index].user2.id === socket.id) {
               if(roomActives[index].user2.answered === 0) {
                   if (currentQuesion.correct === Number(userAnswer)) {
                       roomActives[index].user2.score += 10;
                       roomActives[index].user2.answered += 1
                       io.to(roomId).emit("end", {
                        notify: "Kết thúc rồi",
                        user1: roomActives[index].user1,
                        user2: roomActives[index].user2,
                      });
                     } else {
                       roomActives[index].user2.score -= 0;
                       roomActives[index].user2.answered += 1
                     
                      socket.emit("230", {
                         roomId,
                         user1: roomActives[index].user1,
                         user2: roomActives[index].user2,
                         answer: currentRoomQuestions[roomId].questions[indexQuestion - 1].correct
                     });
                     }
               }
       
               if( roomActives[index].user1.answered &&  roomActives[index].user2.answered){
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
    socket.on("EXIT", () => {
      for(const roomAcitve of roomActives) {
        if(roomAcitve.user1.id === socket.id || roomAcitve.user2.id === socket.id ) {
            io.to(roomAcitve.roomId).emit("666", {
                notify: "Kết thúc rồi",
                user1: roomAcitve.user1,
                user2: roomAcitve.user2,
              });
        }
       }
      });


    //Disconnect
    socket.on('disconnect', function() {
       for(const roomAcitve of roomActives) {
        if(roomAcitve.user1.id === socket.id || roomAcitve.user2.id === socket.id ) {
            io.to(roomAcitve.roomId).emit("555", {
                notify: "Kết thúc rồi",
                user1: roomAcitve.user1,
                user2: roomAcitve.user2,
              });
        }
       }
      });

   //6. Vào phòng ngẫu nhiên
   socket.on("JOINRANDOMROOM", (name) => {
    
    if(roomCreatedNotStart.length) {
        const element = roomCreatedNotStart.pop();
        element.user2 = { id: socket.id, score: 0, answered: 0, name };
        roomActives.push(element);
        socket.join(element.roomId);
        socket.emit("266", {message: 'Đã tìm thấy phòng', roomId: element.roomId, user1: element.user1, user2: element.user2})
    }
    else {
        socket.emit("267", {message: 'Hiện tại không có phòng trống'})
    }
});

  });
}

module.exports = listen;