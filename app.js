let services = JSON.parse(localStorage.getItem("quikpro_services")) || [
  {
    title: "Aide informatique",
    category: "Informatique",
    price: 15,
    description: "Aide pour ordinateur, téléphone et logiciels."
  },
  {
    title: "Tonte de pelouse",
    category: "Jardinage",
    price: 20,
    description: "Je peux aider pour l'entretien du jardin."
  },
  {
    title: "Aide aux devoirs",
    category: "Cours",
    price: 10,
    description: "Soutien scolaire et aide aux exercices."
  }
];

let currentFilter = "Tous";

function saveServices() {
  localStorage.setItem(
    "quikpro_services",
    JSON.stringify(services)
  );
}

function displayServices(list = services) {

  const container = document.getElementById("services");

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>Aucun service trouvé.</p>";
    return;
  }

  list.forEach((service, index) => {

    const card = document.createElement("div");

    card.className = "service";

    card.innerHTML = `
      <h3>${escapeHTML(service.title)}</h3>

      <p class="category">
        ${escapeHTML(service.category)}
      </p>

      <p>
        ${escapeHTML(service.description)}
      </p>

      <p class="price">
        ${service.price} €
      </p>

      <button onclick="contactService(${index})">
        Contacter
      </button>
    `;

    container.appendChild(card);
  });
}

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

function filterServices(category) {

  currentFilter = category;

  const search =
    document.getElementById("search").value.toLowerCase();

  let result = services;

  if (category !== "Tous") {
    result = result.filter(
      service => service.category === category
    );
  }

  if (search) {
    result = result.filter(service =>
      service.title.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search)
    );
  }

  displayServices(result);
}

function searchServices() {
  filterServices(currentFilter);
}

function addService() {

  const title =
    document.getElementById("serviceTitle").value.trim();

  const category =
    document.getElementById("serviceCategory").value;

  const price =
    Number(document.getElementById("servicePrice").value);

  const description =
    document.getElementById("serviceDescription").value.trim();

  if (!title || !description || !price) {
    alert("Remplis tous les champs.");
    return;
  }

  services.push({
    title,
    category,
    price,
    description
  });

  saveServices();

  document.getElementById("serviceTitle").value = "";
  document.getElementById("servicePrice").value = "";
  document.getElementById("serviceDescription").value = "";

  alert("Service publié !");

  showPage("home");

  displayServices();
}

function contactService(index) {

  const service = services[index];

  alert(
    "Tu veux contacter le prestataire pour :\n\n" +
    service.title +
    "\n\nCette fonction pourra ensuite être reliée à une vraie messagerie."
  );
}

function showPage(page) {

  document
    .querySelectorAll("main section")
    .forEach(section => section.classList.add("hidden"));

  document
    .getElementById(page)
    .classList.remove("hidden");

  if (page === "home") {
    displayServices();
  }
}

function saveProfile() {

  const username =
    document.getElementById("username").value.trim();

  if (!username) {
    alert("Entre ton prénom.");
    return;
  }

  localStorage.setItem("quikpro_username", username);

  document.getElementById("profileMessage").textContent =
    "Profil enregistré pour " + username + " !";
}

function loadProfile() {

  const username =
    localStorage.getItem("quikpro_username");

  if (username) {
    document.getElementById("username").value = username;
  }
}

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", event => {

  event.preventDefault();

  deferredPrompt = event;
});

async function installApp() {

  if (!deferredPrompt) {

    alert(
      "Si Chrome ne propose pas l'installation, " +
      "ouvre le menu ⋮ de Chrome puis choisis " +
      "\"Installer l'application\" ou \"Ajouter à l'écran d'accueil\"."
    );

    return;
  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;
}

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker.register("service-worker.js")
      .catch(error => {
        console.log("Service Worker :", error);
      });

  });
}

loadProfile();
displayServices();
