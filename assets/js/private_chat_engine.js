class PrivateChatEngine {
    constructor(chatBoxId, userName,userId,targetId) {
      this.chatBox = $(`#${chatBoxId}`);
      this.userName = userName;
      this.userId=userId;
      this.targetId=targetId;
      this.socket = io.connect("http://localhost:4000");
  
      if (this.userName) {
        this.connectionHandler();
      }
    }
  
    connectionHandler() {
      let self = this;
      this.socket.on("connect", function () {
        console.log("Private: connection established using sockets...!");
        self.socket.emit("join_room", {
          user_email: self.userName,
          chatroom: "quiklink private chat",
        });
  
        self.socket.on("user_joined", function (data) {
          console.log("Private: a user joined: ", data);
        });
      });
  
      // send a message on clicking the send button.
      $("#send-message").click(function () {
        console.log(self.userId,self.targetId)
          let pvtMsg = $("#chat-message-input").val();
        if (pvtMsg != "") {
          self.socket.emit("send_message", {
            message: pvtMsg,
            user_email: self.userName,
            chatroom: "quiklink private chat",
          });

          $.ajax({
            url:"/chat/addChat",
            method:"POST",
            data:{
                message:pvtMsg,
                userId:self.userId,
                targetId:self.targetId,
            },
            success: function(response) {
                // Handle the success response if needed
                console.log("Message sent successfully");
              },
              error: function(error) {
                // Handle the error response if needed
                console.error("Error sending message", error);
              }
          })
        }
      });
  
      self.socket.on("receive_message", function (data) {
        console.log("Private: message received", data.message);
  
        let newMessage = $("<li>");
        let messageType = "other-message";
        if (data.user_email == self.userName) {
          messageType = "self-message";
        }
  
        newMessage.append($("<span>", {
          html: data.message,
        }));
  
        newMessage.addClass(messageType);
  
        $('#chat-messages-list').append(newMessage);
      });
    }
  }