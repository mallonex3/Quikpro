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
let deferredPrompt = null;

function saveServices() {
  localStorage.setItem("quikpro_services", JSON.stringify(services));
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = String(text ?? "");
  return div.innerHTML;
}

function getFilteredServices() {
  const search = document
    .getElementById("search")
    .value
    .trim()
    .toLowerCase();

  let result = services;

  if (currentFilter !== "Tous") {
    result = result.filter(
      service => service.category === currentFilter
    );
  }

  if (search) {
    result = result.filter(service =>
      service.title.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search) ||
      service.category.toLowerCase().includes(search)
    );
  }

  return result;
}

function displayServices(list = getFilteredServices()) {
  const container = document.getElementById("services");

  if (!container) return;

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div class="service">
        <h3>Aucun service trouvé</h3>
        <p>Essaie une autre recherche ou une autre catégorie.</p>
      </div>
    `;
    return;
  }

  list.forEach(service => {
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
        ${escapeHTML(service.price)} €
      </p>

      <button onclick="contactService('${encodeURIComponent(service.title)}')">
        💬 Contacter
      </button>
    `;

    container.appendChild(card);
  });
}

function filterServices(category) {
  currentFilter = category;
  displayServices();
}

function searchServices() {
  displayServices();
}

function addService() {
  const title = document
    .getElementById("serviceTitle")
    .value
    .trim();

  const category =
    document.getElementById("serviceCategory").value;

  const price = Number(
    document.getElementById("servicePrice").value
  );

  const description = document
    .getElementById("serviceDescription")
    .value
    .trim();

  if (!title || !description || !price || price < 0) {
    alert("Remplis correctement tous les champs.");
    return;
  }

  services.push({
    title: title,
    category: category,
    price: price,
    description: description
  });

  saveServices();

  document.getElementById("serviceTitle").value = "";
  document.getElementById("servicePrice").value = "";
  document.getElementById("serviceDescription").value = "";

  alert("Service publié !");

  showPage("home");
  displayServices();
}

function contactService(encodedTitle) {
  const title = decodeURIComponent(encodedTitle);

  const message =
    "Bonjour, je suis intéressé(e) par ton service : " +
    title +
    ". Est-ce que tu peux m'en dire plus ?";

  const encodedMessage = encodeURIComponent(message);

  const whatsappURL =
    "https://wa.me/?text=" + encodedMessage;

  const choice = confirm(
    "Contacter le prestataire pour :\n\n" +
    title +
    "\n\n" +
    "Appuie sur OK pour ouvrir WhatsApp."
  );

  if (choice) {
    window.open(whatsappURL, "_blank");
  }
}

function showPage(page) {
  document
    .querySelectorAll("main section")
    .forEach(section => {
      section.classList.add("hidden");
    });

  const selectedPage = document.getElementById(page);

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  if (page === "home") {
    displayServices();
  }
}

function saveProfile() {
  const username = document
    .getElementById("username")
    .value
    .trim();

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

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
});

async function installApp() {
  if (!deferredPrompt) {
    alert(
      "Si Chrome ne propose pas l'installation, " +
      "ouvre le menu ⋮ de Chrome puis choisis " +
      "\"Installer l'application\" ou " +
      "\"Ajouter à l'écran d'accueil\"."
    );

    return;
  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch(error => {
        console.log("Service Worker :", error);
      });
  });
}

loadProfile();
displayServices();
