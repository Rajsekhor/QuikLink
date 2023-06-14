const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");
let data = [];

if (localUser) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.trim().toLowerCase();
    console.log(value);
    if (value === "") {
      userCardContainer.classList.add("hide");
    } else {
      userCardContainer.classList.remove("hide");
    }

    data.forEach((user) => {
      const isVisible =
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value);
      user.element.classList.toggle("hide", !isVisible);
    });
  });

  userSearch = "[" + userSearch + "]";
  userSearch = userSearch.replaceAll("&#39;", '"');
  userSearch = userSearch.replaceAll("&#34;", '"');
  userSearch = userSearch.replaceAll("email", '"email"');
  userSearch = userSearch.replaceAll("name", '"name"');
  userSearch = userSearch.replaceAll("_id", '"_id"');
  userSearch = userSearch.replaceAll("new ObjectId(", "");
  userSearch = userSearch.replaceAll(")", "");

  const parseduserSearch = JSON.parse(userSearch);

  data = parseduserSearch.map((user) => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const header = card.querySelector("[data-header]");
    const body = card.querySelector("[data-body]");
    const link = card.querySelector("[profile-link]");
    link.href = "/users/profile/" + user._id + "/" + localUser;
    header.textContent = user.name;
    body.textContent = user.email;
    userCardContainer.append(card);
    return { name: user.name, email: user.email, element: card };
  });
}
