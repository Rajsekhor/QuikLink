class ChatEngine {
    constructor(chatBoxId, userName) {
      this.chatBox = $(`#${chatBoxId}`);
      this.userName = userName;
  
      this.socket = io.connect("http://localhost:5000");
  
      if (this.userName) {
        this.connectionHandler();
      }
    }
  
    connectionHandler() {
      let self = this;
      this.socket.on("connect", function () {
        console.log("connection established using sockets...!");
        self.socket.emit("join_room", {
          user_email: self.userName,
          chatroom: "quiklink",
        });
  
        self.socket.on("user_joined", function (data) {
          console.log("a user joined: ", data);
        });
      });
  
      // send a message on clicking the send button.
      $("#send-message").click(function () {
        let msg = $("#chat-message-input").val();
        if (msg != "") {
          self.socket.emit("send_message", {
            message: msg,
            user_email: self.userName,
            chatroom: "quiklink",
          });
        }
      });
  
      self.socket.on("receive_message", function (data) {
        console.log("message received", data.message);
  
        let newMessage = $("<li>");
        let messageType = "other-message";
        if (data.user_email == self.userName) {
          messageType = "self-message";
        }
  
        newMessage.append($("<span>", {
          html: data.message,
        }));
        // sub stands for subscript
        newMessage.append($("<sub>", {
          html: data.user_email,
        }));
  
        newMessage.addClass(messageType);
  
        $('#chat-messages-list').append(newMessage);
      });
    }
  }