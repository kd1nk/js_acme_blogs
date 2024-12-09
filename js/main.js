function createElemWithText(elementType = "p", textContent = "", className) {
    const element = document.createElement(elementType);
  
    element.textContent = textContent;
  
    if (className) {
      element.className = className;
    }
    return element;
  }
  
  function createSelectOptions(users) {
    if (!users) return undefined;
  
    const options = [];
  
    for (const user of users) {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      options.push(option);
    }
    return options;
  }
  
  function toggleCommentSection(postId) {
    if (!postId) return undefined;
  
    const section = document.querySelector(`section[data-post-id='${postId}']`);
  
    if (!section) return null;
  
    section.classList.toggle("hide");
  
    return section;
  }
  
  function toggleCommentButton(postId) {
    if (!postId) return undefined;
  
    const button = document.querySelector(`button[data-post-id='${postId}']`);
  
    if (!button) return null;
  
    button.textContent =
      button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  
    return button;
  }
  
  function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;
  
    let child = parentElement.lastElementChild;
  
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
    return parentElement;
  }
  
  function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
  
    if (!buttons.length) return [];
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
  
      if (postId) {
        button.addEventListener("click", (event) => {
          toggleComments(event, postId);
        });
      }
    });
    return buttons;
  }
  
  function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    buttons.forEach((button) => {
      const postId = button.dataset.id;
  
      if (postId) {
        button.removeEventListener("click", handleButtonClick);
      }
    });
    return buttons;
  }
  
  function createComments(comments) {
    if (!comments) {
      return undefined;
    }
    const fragment = document.createDocumentFragment();
    comments.forEach((comment) => {
      const article = document.createElement("article");
      const h3 = createElemWithText("h3", comment.name);
      const pBody = createElemWithText("p", comment.body);
      const pEmail = createElemWithText("p", `From: ${comment.email}`);
  
      article.appendChild(h3);
      article.appendChild(pBody);
      article.appendChild(pEmail);
  
      fragment.appendChild(article);
    });
    return fragment;
  }
  
  function populateSelectMenu(users) {
    if (!users || !Array.isArray(users)) {
      return undefined;
    }
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);
    options.forEach((option) => {
      selectMenu.appendChild(option);
    });
    return selectMenu;
  }
  
  async function getUsers() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await response.json();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  
  async function getUserPosts(userId) {
    if (!userId) {
      return undefined;
    }
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }
  
  async function getUser(userId) {
    if (!userId) {
      return undefined;
    }
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  
  async function getPostComments(postId) {
    if (!postId) {
      return undefined;
    }
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
      const comments = await response.json();
      return comments;
    } catch (error) {
      console.error("Error fetching post comments:", error);
    }
  }
  
  async function displayComments(postId) {
    if (!postId) {
      return undefined;
    }
  
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
  
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
  
    section.appendChild(fragment);
    return section;
  }
  
  async function createPosts(posts) {
    if (!posts || !Array.isArray(posts)) {
      return undefined;
    }
  
    const fragment = document.createDocumentFragment();
  
    for (const post of posts) {
      const article = document.createElement("article");
  
      const h2 = createElemWithText("h2", post.title);
      const pBody = createElemWithText("p", post.body);
      const pId = createElemWithText("p", `Post ID: ${post.id}`);
  
      const author = await getUser(post.userId);
      const pAuthor = createElemWithText(
        "p",
        `Author: ${author.name} with ${author.company.name}`
      );
      const pCatchPhrase = createElemWithText("p", author.company.catchPhrase);
  
      const button = createElemWithText("button", "Show Comments");
      button.dataset.postId = post.id;
  
      const section = await displayComments(post.id);
  
      article.append(h2, pBody, pId, pAuthor, pCatchPhrase, button, section);
      fragment.appendChild(article);
    }
  
    return fragment;
  }
  
  async function displayPosts(posts) {
    const main = document.querySelector("main");
  
    const element =
      posts && posts.length
        ? await createPosts(posts)
        : createElemWithText(
            "p",
            "Select an Employee to display their posts.",
            "default-text"
          );
  
    main.appendChild(element);
    return element;
  }
  
  function toggleComments(event, postId) {
    if (!event || !postId) {
      return undefined;
    }
  
    event.target.listener = true;
  
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
  
    return [section, button];
  }
  
  async function refreshPosts(posts) {
    if (!posts) {
      return undefined;
    }
  
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
  
    return [removeButtons, main, fragment, addButtons];
  }
  
  const selectMenuChangeEventHandler = async (e) => {
    if (!e || !e.target) {
        return undefined;
    }

    try {
        const selectMenu = e.target;
        selectMenu.disabled = true;

        let userId = e.target.value || 1;

        let posts = await getUserPosts(userId);

        if (!Array.isArray(posts) || posts.length === 0) {
            posts = new Array(10).fill({});
        }

        let refreshPostsArray = await refreshPosts(posts);

        if (!Array.isArray(refreshPostsArray)) {
            refreshPostsArray = [];
        }

        selectMenu.disabled = false;

        return [userId, posts, refreshPostsArray];

    } catch (error) {
        console.error("An error occurred in selectMenuChangeEventHandler: ", error);
        return [1, [], []];
    }
};

  
  async function initPage() {
    try {
      const users = await getUsers();
      const select = populateSelectMenu(users);
  
      return [users, select];
    } catch (error) {
      console.error("Error initializing page:", error);
      throw error;
    }
  }
  
  function initApp() {
    initPage().then(() => {
      const selectMenu = document.getElementById("selectMenu");
      selectMenu.addEventListener("change", selectMenuChangeEventHandler);
    });
  }

document.addEventListener("DOMContentLoaded", initApp);