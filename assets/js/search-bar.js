const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
let data = [];

searchInput.addEventListener("input", e => {
  const value = e.target.value.trim().toLowerCase();
  console.log(value)
  if (value === '') {
    userCardContainer.classList.add('hide');
  } else {
    userCardContainer.classList.remove('hide');
  }
  
  data.forEach(user => {
    const isVisible = user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value);
    user.element.classList.toggle("hide", !isVisible);
  });
});


users="["+users+"]";
users=users.replaceAll("&#39;",'"')
users=users.replaceAll("&#34;",'"')
users=users.replaceAll("email",'"email"')
users=users.replaceAll("name",'"name"')
users=users.replaceAll("_id",'"_id"')
users=users.replaceAll("new ObjectId(",'')
users=users.replaceAll(")",'')


const parsedUsers = JSON.parse(users);


data=parsedUsers.map(user=>{
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const header=card.querySelector("[data-header]")
    const body=card.querySelector("[data-body]")
    header.textContent=user.name;
    body.textContent=user.email;
    userCardContainer.append(card)
    return { name:user.name,email:user.email,element:card}
    
})