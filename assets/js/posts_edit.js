class editPost {
    constructor(postElement) {
      this.postElement = postElement;
      console.log(this.postElement)
      let editPostForm = $('#postEdit-' + postElement);
      let postContent = $('#postEditContent-' + postElement);
      editPostForm.submit(function (e) {

        e.preventDefault();
  
        $.ajax({
          type: 'post',
          url: '/posts/update/'+postElement,
          data: {
            content: postContent.val()
          },
          success: function (response) {
            let postContent=document.getElementById('postContent-'+postElement) 
            postContent.innerHTML=$('#postEditContent-' + postElement).val();
            console.log("Post edited successfully");
            new Noty({
              theme: 'relax',
              text: 'Post Edited Successfully!',
              type: 'success',
              layout: 'topRight',
              timeout: 1500
            }).show();
          },
          error: function (error) {
            console.error("Error editing post", error);
          },
        });
      });
    }
  }
  