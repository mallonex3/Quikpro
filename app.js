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

function displayServices(list = services) {
  const container = document.getElementById("services");

  if (!container) return;

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
        ${escapeHTML(service.price)} €
      </p>

      <button onclick="contactService(${index})">
        💬 Contacter
      </button>
    `;

    container.appendChild(card);
  });
}

function filterServices(category) {
  currentFilter = category;

  const searchInput = document.getElementById("search");
  const search = searchInput
    ? searchInput.value.toLowerCase()
    : "";

  let result = services;

  if (category !== "Tous") {
    result = result.filter(
      service => service.category === category
    );
  }

  if (search) {
    result = result.filter(service =>
      service.title.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search) ||
      service.category.toLowerCase().includes(search)
    );
  }

  displayServices(result);
}

function searchServices() {
  filterServices(currentFilter);
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

  if (!title || !description || !price) {
    alert("Remplis tous les champs.");
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


/* ============================= */
/*       CONTACT WHATSAPP        */
/* ============================= */

function contactService(index) {

  const service = services[index];

  const message =
    "Bonjour, je suis intéressé(e) par votre service : " +
    service.title +
    ". Est-ce que vous pouvez m'en dire plus ?";

  const encodedMessage =
    encodeURIComponent(message);

  const whatsappURL =
    "https://wa.me/?text=" + encodedMessage;

  const confirmation = confirm(
    "Tu veux contacter le prestataire pour :\n\n" +
    service.title +
    "\n\n" +
    "Appuie sur OK pour ouvrir WhatsApp."
  );

  if (confirmation) {
    window.open(whatsappURL, "_blank");
  }
}


/* ============================= */
/*          NAVIGATION            */
/* ============================= */

function showPage(page) {

  document
    .querySelectorAll("main section")
    .forEach(section => {
      section.classList.add("hidden");
    });

  const selectedPage =
    document.getElementById(page);

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  if (page === "home") {
    displayServices();
  }
}


/* ============================= */
/*            PROFIL              */
/* ============================= */

function saveProfile() {

  const username =
    document
      .getElementById("username")
      .value
      .trim();

  if (!username) {
    alert("Entre ton prénom.");
    return;
  }

  localStorage.setItem(
    "quikpro_username",
    username
  );

  document.getElementById(
    "profileMessage"
  ).textContent =
    "Profil enregistré pour " +
    username +
    " !";
}

function loadProfile() {

  const username =
    localStorage.getItem(
      "quikpro_username"
    );

  if (username) {
    document.getElementById(
      "username"
    ).value = username;
  }
}


/* ============================= */
/*       INSTALLATION PWA         */
/* ============================= */

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;
  }
);

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


/* ============================= */
/*        SERVICE WORKER          */
/* ============================= */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("service-worker.js")
      .catch(error => {
        console.log(
          "Service Worker :",
          error
        );
      });

  });
}


/* ============================= */
/*             START              */
/* ============================= */

loadProfile();
displayServices();
