function displayFlashMessage(message, type) {
    new Noty({
      text: message,
      type: type,
      theme: "relax",
      timeout: 1500, // Adjust the timeout as needed
    }).show();
  }
{
    // method to submit the form data for new post using AJAX
    let createPost = function() {
        let newPostForm = $("#new-post-form");

        newPostForm.submit(function(event) {
            event.preventDefault();

            $.ajax({
                type: "post",
                url: "/posts/create",
                data: newPostForm.serialize(),
                success: function(data) {
                    let newPost = newPostDom(data.data.post);
                    $(`#posts-list-container>ul`).prepend(newPost);
                    deletePost($(".delete-post-button", newPost));
                    displayFlashMessage(data.message, "success");
                },
                error: function(error) {
                    console.log(error.responseText);
                    displayFlashMessage("Error occurred while creating the post", "error");
                }
            });
        });
    };

    // method to create a post in DOM
    let newPostDom = function(post) {
        let text = document.getElementById('username-header').textContent;
        return $(`<li id="post-${post._id}">
        <p>
        <small>
            <a class="delete-post-button" href="localhost:8000/posts/destroy/${post._id}">Delete</a>
        </small>
        ${post.content}
        <br>
        <small>
            ${text}
        </small>
        </p>
        <div class="post-comments">
            <form action="/comments/create" method="post">
                <input type="text" name="content" placeholder="Type here to add comment" required>
                <input type="hidden" name="post" value="${post._id}" method="post">
                <input type="submit" value="Add Comment">
            </form>
            <div class="posts-comments-list">
                <ul id="posts-comments-${post._id}">
                </ul>
            </div>
        </div>
    </li>`);
    };

    // method to delete a post from DOM
    let deletePost = function(deleteLink) {
        $(deleteLink).click(function(event) {
          event.preventDefault();
          console.log("Delete link clicked");
      
          $.ajax({
            type: "get",
            url: $(deleteLink).prop("href"),
            success: function(data) {
              console.log("Delete request successful:", data);
              $(`#post-${data.data.post_id}`).remove();
            },
            error: function(error) {
              console.log("Error in delete request:", error.responseText);
            }
          });
        });
      };

    createPost();
}
