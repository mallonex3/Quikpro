let services = JSON.parse(localStorage.getItem("quikpro_services")) || [
  {
    title: "Aide informatique",
    category: "Informatique",
    price: 15,
    description: "Aide pour ordinateur, téléphone et logiciels.",
    phone: ""
  },
  {
    title: "Tonte de pelouse",
    category: "Jardinage",
    price: 20,
    description: "Je peux aider pour l'entretien du jardin.",
    phone: ""
  },
  {
    title: "Aide aux devoirs",
    category: "Cours",
    price: 10,
    description: "Soutien scolaire et aide aux exercices.",
    phone: ""
  }
];

let currentFilter = "Tous";
let deferredPrompt = null;


/* ============================= */
/*          SAUVEGARDE           */
/* ============================= */

function saveServices() {
  localStorage.setItem(
    "quikpro_services",
    JSON.stringify(services)
  );
}


/* ============================= */
/*        PROTECTION HTML         */
/* ============================= */

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = String(text ?? "");
  return div.innerHTML;
}


/* ============================= */
/*     CHAMP WHATSAPP AUTO       */
/* ============================= */

function createWhatsAppField() {

  if (document.getElementById("servicePhone")) {
    return;
  }

  const description =
    document.getElementById("serviceDescription");

  if (!description) {
    return;
  }

  const phoneLabel =
    document.createElement("label");

  phoneLabel.textContent =
    "Numéro WhatsApp";

  phoneLabel.setAttribute(
    "for",
    "servicePhone"
  );

  const phoneInput =
    document.createElement("input");

  phoneInput.id = "servicePhone";
  phoneInput.type = "tel";
  phoneInput.placeholder = "Exemple : 06 12 34 56 78";
  phoneInput.autocomplete = "tel";

  phoneInput.style.display = "block";
  phoneInput.style.width = "100%";
  phoneInput.style.boxSizing = "border-box";
  phoneInput.style.marginTop = "8px";
  phoneInput.style.marginBottom = "15px";
  phoneInput.style.padding = "10px";

  description.insertAdjacentElement(
    "afterend",
    phoneLabel
  );

  phoneLabel.insertAdjacentElement(
    "afterend",
    phoneInput
}


/* ============================= */
/*       AFFICHER SERVICES       */
/* ============================= */

function displayServices(list = services) {

  const container =
    document.getElementById("services");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      "<p>Aucun service trouvé.</p>";
    return;
  }

  list.forEach((service, index) => {

    const card =
      document.createElement("div");

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


/* ============================= */
/*            FILTRES            */
/* ============================= */

function filterServices(category) {

  currentFilter = category;

  const searchInput =
    document.getElementById("search");

  const search = searchInput
    ? searchInput.value.toLowerCase()
    : "";

  let result = services;

  if (category !== "Tous") {

    result = result.filter(
      service =>
        service.category === category
    );
  }

  if (search) {

    result = result.filter(service =>
      service.title
        .toLowerCase()
        .includes(search) ||

      service.description
        .toLowerCase()
        .includes(search) ||

      service.category
        .toLowerCase()
        .includes(search)
    );
  }

  displayServices(result);
}


function searchServices() {
  filterServices(currentFilter);
}


/* ============================= */
/*         AJOUT SERVICE          */
/* ============================= */

function addService() {

  createWhatsAppField();

  const titleElement =
    document.getElementById("serviceTitle");

  const categoryElement =
    document.getElementById("serviceCategory");

  const priceElement =
    document.getElementById("servicePrice");

  const descriptionElement =
    document.getElementById("serviceDescription");

  const phoneElement =
    document.getElementById("servicePhone");


  if (
    !titleElement ||
    !categoryElement ||
    !priceElement ||
    !descriptionElement
  ) {

    alert(
      "Impossible de trouver le formulaire."
    );

    return;
  }


  const title =
    titleElement.value.trim();

  const category =
    categoryElement.value;

  const price =
    Number(priceElement.value);

  const description =
    descriptionElement.value.trim();

  const phone =
    phoneElement
      ? phoneElement.value.trim()
      : "";


  if (!title || !description || !price) {

    alert(
      "Remplis tous les champs."
    );

    return;
  }


  if (!phone) {

    alert(
      "Ajoute ton numéro WhatsApp."
    );

    return;
  }


  let cleanPhone =
    phone.replace(/\D/g, "");


  if (cleanPhone.startsWith("0")) {

    cleanPhone =
      "33" + cleanPhone.substring(1);
  }


  services.push({

    title: title,

    category: category,

    price: price,

    description: description,

    phone: cleanPhone
  });


  saveServices();


  titleElement.value = "";

  priceElement.value = "";

  descriptionElement.value = "";

  if (phoneElement) {
    phoneElement.value = "";
  }


  alert("Service publié !");


  showPage("home");

  displayServices();
}


/* ============================= */
/*        CONTACT WHATSAPP       */
/* ============================= */

function contactService(index) {

  const service =
    services[index];


  if (!service) {

    alert(
      "Service introuvable."
    );

    return;
  }


  if (!service.phone) {

    alert(
      "Ce service n'a pas encore de numéro WhatsApp."
    );

    return;
  }


  let phone =
    String(service.phone)
      .replace(/\D/g, "");


  if (phone.startsWith("0")) {

    phone =
      "33" + phone.substring(1);
  }


  const message =
    "Bonjour, je suis intéressé(e) par votre service : " +
    service.title +
    ". Est-ce que vous pouvez m'en dire plus ?";


  const encodedMessage =
    encodeURIComponent(message);


  const whatsappURL =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodedMessage;


  window.open(
    whatsappURL,
    "_blank"
  );
}


/* ============================= */
/*           NAVIGATION           */
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

    selectedPage.classList.remove(
      "hidden"
    );
  }


  if (page === "home") {

    displayServices();
  }


  if (page === "add") {

    createWhatsAppField();
  }
}


/* ============================= */
/*             PROFIL             */
/* ============================= */

function saveProfile() {

  const usernameElement =
    document.getElementById("username");

  if (!usernameElement) {
    return;
  }

  const username =
    usernameElement.value.trim();


  if (!username) {

    alert(
      "Entre ton prénom."
    );

    return;
  }


  localStorage.setItem(
    "quikpro_username",
    username
  );


  const messageElement =
    document.getElementById(
      "profileMessage"
    );


  if (messageElement) {

    messageElement.textContent =
      "Profil enregistré pour " +
      username +
      " !";
  }
}


function loadProfile() {

  const username =
    localStorage.getItem(
      "quikpro_username"
    );


  const usernameElement =
    document.getElementById("username");


  if (
    username &&
    usernameElement
  ) {

    usernameElement.value =
      username;
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

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("service-worker.js")
        .catch(error => {

          console.log(
            "Service Worker :",
            error
          );

        });
    }
  );
}


/* ============================= */
/*             START              */
/* ============================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    createWhatsAppField();

    loadProfile();

    displayServices();
  }
);
