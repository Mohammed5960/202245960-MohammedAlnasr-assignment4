// ===============================
// Theme State Management
// ===============================
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
} else {
    toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙";
    }
});

// ===============================
// Time on Site Feature
// ===============================
const siteTimer = document.getElementById("siteTimer");
let secondsOnSite = 0;

setInterval(() => {
    secondsOnSite++;
    siteTimer.textContent = `You have been on this site for ${secondsOnSite} seconds.`;
}, 1000);

// ===============================
// Visitor Name State Management
// ===============================
const visitorNameInput = document.getElementById("visitorName");
const saveNameBtn = document.getElementById("saveNameBtn");
const clearNameBtn = document.getElementById("clearNameBtn");
const greetingMessage = document.getElementById("greetingMessage");

function showMessage(element, text, color) {
    element.textContent = text;
    element.style.color = color;
    element.classList.add("show");
}

function hideMessage(element) {
    element.textContent = "";
    element.classList.remove("show");
}

function loadVisitorName() {
    const savedName = localStorage.getItem("visitorName");

    if (savedName) {
        visitorNameInput.value = savedName;
        showMessage(greetingMessage, `Welcome back, ${savedName}!`, "green");
    }
}

saveNameBtn.addEventListener("click", () => {
    const visitorName = visitorNameInput.value.trim();

    if (visitorName.length < 2) {
        showMessage(greetingMessage, "Please enter a name with at least 2 characters.", "red");
        return;
    }

    localStorage.setItem("visitorName", visitorName);
    showMessage(greetingMessage, `Nice to meet you, ${visitorName}! Your name has been saved.`, "green");
});

clearNameBtn.addEventListener("click", () => {
    localStorage.removeItem("visitorName");
    visitorNameInput.value = "";
    showMessage(greetingMessage, "Saved name removed.", "orange");
});

loadVisitorName();

// ===============================
// Project Search, Filter, and Sort
// ===============================
const projectSearch = document.getElementById("projectSearch");
const categoryFilter = document.getElementById("categoryFilter");
const sortProjects = document.getElementById("sortProjects");
const projectsContainer = document.getElementById("projectsContainer");
const searchMessage = document.getElementById("searchMessage");

const projects = [
    {
        title: "Portfolio Website",
        description: "A responsive personal portfolio built with HTML, CSS, and JavaScript.",
        category: "web",
        year: 2026
    },
    {
        title: "Landing Page Design",
        description: "A modern landing page layout using Flexbox and responsive design techniques.",
        category: "web",
        year: 2025
    },
    {
        title: "Contact Form Project",
        description: "A simple interactive contact form with validation and user feedback.",
        category: "form",
        year: 2026
    },
    {
        title: "Task Tracker App",
        description: "A JavaScript-based application for adding, removing, and organizing daily tasks.",
        category: "javascript",
        year: 2024
    }
];

function renderProjects(projectList) {
    projectsContainer.innerHTML = "";

    if (projectList.length === 0) {
        showMessage(searchMessage, "No projects match your current search or filter.", "red");
        return;
    }

    hideMessage(searchMessage);

    projectList.forEach((project) => {
        const card = document.createElement("div");
        card.className = "project-card";

        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <span class="card-tag">${capitalizeText(project.category)}</span>
            <span class="card-year">${project.year}</span>
        `;

        projectsContainer.appendChild(card);
    });

    showMessage(searchMessage, `Showing ${projectList.length} project(s).`, "green");
}

function capitalizeText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function updateProjects() {
    const searchValue = projectSearch.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortProjects.value;

    let filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchValue) ||
            project.description.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" || project.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (selectedSort === "az") {
        filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "za") {
        filteredProjects.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === "newest") {
        filteredProjects.sort((a, b) => b.year - a.year);
    } else if (selectedSort === "oldest") {
        filteredProjects.sort((a, b) => a.year - b.year);
    }

    renderProjects(filteredProjects);
}

projectSearch.addEventListener("input", updateProjects);
categoryFilter.addEventListener("change", updateProjects);
sortProjects.addEventListener("change", updateProjects);

renderProjects(projects);

// ===============================
// GitHub API Integration
// Replace the username below with your real GitHub username
// ===============================
const githubUsername = "Mohammed5960";
const repoContainer = document.getElementById("repoContainer");
const repoStatus = document.getElementById("repoStatus");

async function loadGitHubRepos() {
    repoStatus.textContent = "Loading repositories...";
    repoContainer.innerHTML = "";

    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`);

        if (!response.ok) {
            throw new Error("Failed to fetch repositories.");
        }

        const repos = await response.json();

        if (repos.length === 0) {
            repoStatus.textContent = "No public repositories were found.";
            return;
        }

        repoStatus.textContent = `Loaded ${repos.length} repositories successfully.`;

        repos.slice(0, 6).forEach((repo) => {
            const repoCard = document.createElement("div");
            repoCard.className = "repo-card";

            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : "No description available."}</p>
                <span class="repo-language">${repo.language ? repo.language : "Unknown"}</span>
                <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                <br>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
            `;

            repoContainer.appendChild(repoCard);
        });
    } catch (error) {
        repoStatus.textContent = "Unable to load GitHub repositories right now. Please try again later.";
    }
}

loadGitHubRepos();

// ===============================
// Advanced Contact Form Validation
// ===============================
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    hideMessage(formMessage);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    let isFormValid = true;

    if (nameValue === "") {
        nameError.textContent = "Please enter your name.";
        isFormValid = false;
    } else if (nameValue.length < 2) {
        nameError.textContent = "Name must be at least 2 characters long.";
        isFormValid = false;
    }

    if (emailValue === "") {
        emailError.textContent = "Please enter your email.";
        isFormValid = false;
    } else if (!isValidEmail(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        isFormValid = false;
    }

    if (messageValue === "") {
        messageError.textContent = "Please enter your message.";
        isFormValid = false;
    } else if (messageValue.length < 10) {
        messageError.textContent = "Message must be at least 10 characters long.";
        isFormValid = false;
    }

    if (!isFormValid) {
        showMessage(formMessage, "Please fix the errors above before submitting.", "red");
        return;
    }

    showMessage(formMessage, "Message sent successfully! I will get back to you soon.", "green");
    form.reset();
});
