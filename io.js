const genQuestion = require("./question");
const events = require("events");
const eventEmitter = new events.EventEmitter();
let roomCreatedNotStart = [];
let roomActives = [];
const currentRoomQuestions = {};

const MAX_Q = 5;
const MAX_TIME = 150000;

function handle(io) {
  eventEmitter.on("nextQuestion", ({ roomId, indexQuestion }) => {
    console.log("indexQuestion === MAX_Q - 1", indexQuestion, MAX_Q - 1);
    const current = currentRoomQuestions[roomId];
    const { questions, currentIndex } = current;
    if (current.timeout) {
      clearTimeout(current.timeout);
    }

    const timeout = setTimeout(() => {
      currentRoomQuestions[roomId].currentIndex += 1;
      eventEmitter.emit("nextQuestion", roomId);
    }, MAX_TIME);
    current.timeout = timeout;
    const index = roomActives.findIndex((object) => {
      return object.roomId === roomId;
    });
    if (current.max <= MAX_Q) {
      io.to(roomId).emit("question", {
        question: questions[currentIndex],
        currentIndex,
        time: 150,
        roomId,
        user1: roomActives[index].user1,
        user2: roomActives[index].user2,
      });
    }
    if (indexQuestion === MAX_Q - 1) {
      io.to(roomId).emit("end", {
        notify: "Kết thúc rồi",
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
        user1: { id: socket.id, score: 0, answered: false },
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
      element.user2 = { id: socket.id, score: 0, answered: false };
      roomActives.push(element);
      console.log("roomCreatedNotStar", roomCreatedNotStart);
      socket.join(roomId);
      socket.emit("210", "Bạn đã tham gia vào phòng");
      io.to(roomId).emit("215", { message: "Đã có 2 người chơi", roomId });
    });
    // 3. Bắt đầu trò chơi
    socket.on("STARTGAME", (roomId) => {
      const index = roomActives.findIndex((object) => {
        return object.roomId === roomId;
      });

      io.to(roomId).emit("233", {
        title: "Trò chơi bắt đầu rồi",
        check: true,
        roomId,
        user1: roomActives[index].user1,
        user1: roomActives[index].user2,
      });
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
    });

    // 4. Nhận câu trả lời của client
    socket.on("ANSWER", ({ roomId, userAnswer, indexQuestion }) => {
      const current = currentRoomQuestions[roomId];
      const currentQuesion = current.questions[current.currentIndex];
      console.log(indexQuestion, currentQuesion);

      const index = roomActives.findIndex((object) => {
        return object.roomId === roomId;
      });
     if(indexQuestion < MAX_Q - 1) {
        if (roomActives[index].user1.id === socket.id) {
            console.log("user11111", socket.id);
            if (currentQuesion.correct === Number(userAnswer)) {
              roomActives[index].user1.score += 10;
    
              currentRoomQuestions[roomId].currentIndex += 1;
              eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
            } else if (currentQuesion.correct !== Number(userAnswer)) {
              roomActives[index].user1.score -= 10;
    
              currentRoomQuestions[roomId].currentIndex += 1;
              eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
            }
          } else if (roomActives[index].user2.id === socket.id) {
            console.log("user2222", socket.id);
            if (currentQuesion.correct === Number(userAnswer)) {
              roomActives[index].user2.score += 10;
              currentRoomQuestions[roomId].currentIndex += 1;
              eventEmitter.emit("nextQuestion", { roomId, indexQuestion });
            } else if (currentQuesion.correct !== Number(userAnswer)) {
              roomActives[index].user2.score -= 10;
    
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
              roomActives[index].user1.score -= 10;
    
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
              roomActives[index].user2.score -= 10;
    
              io.to(roomId).emit("end", {
                notify: "Kết thúc rồi",
                user1: roomActives[index].user1,
                user2: roomActives[index].user2,
              });
            }
          }
     }
      //   io.to(roomId).emit("230", {
      //     user1: roomActives[index].user1,
      //     user2: roomActives[index].user2,
      //   });
      //   if (
      //     roomActives[index].user1.answered &&
      //     roomActives[index].user1.answered
      //   ) {
      //     currentRoomQuestions[roomId].currentIndex += 1;
      //     eventEmitter.emit("nextQuestion", roomId);
      //   }

      //   if (
      //     currentRoomQuestions[roomId].questions[indexQuestion].index >=
      //     MAX_Q - 1
      //   ) {
      //     io.to(roomId).emit("end", {
      //       notify: "Hết câu hỏi",
      //       score: 10000,
      //       roomId,
      //     });
      //   }
    });
    // 5. Người chơi thoát phòng
    socket.on("EXITROOM ", () => {
      console.log("Client exit room");
    });

    socket.on("test", () => {
      socket.emit("ré");
    });
  });
}

module.exports = listen;
