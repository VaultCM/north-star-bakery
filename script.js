const productData = [
  { id: "bread", name: "Artisan Bread", price: "$5-$10 per loaf" },
  { id: "pastries", name: "Fresh Pastries", price: "$3-$6 each" },
  { id: "cakes", name: "Custom Cakes", price: "$30-$75" },
  { id: "signature-loaf", name: "Signature Loaf", price: "$8-$12" }
];

const favoriteMessages = [
  "Saved to your favorites.",
  "Already in your favorites."
];

function getFavorites() {
  const saved = localStorage.getItem("northStarFavorites");
  return saved ? JSON.parse(saved) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem("northStarFavorites", JSON.stringify(favorites));
}

function updateFavoriteDisplay() {
  const favorites = getFavorites();
  const count = document.getElementById("favorite-count");
  const list = document.getElementById("favorite-list");

  if (count) {
    count.textContent = favorites.length;
  }

  if (list) {
    list.innerHTML = "";
    if (favorites.length === 0) {
      list.innerHTML = "<li>No favorites saved yet.</li>";
      return;
    }

    favorites.forEach((favoriteId) => {
      const product = productData.find((item) => item.id === favoriteId);
      if (product) {
        const item = document.createElement("li");
        item.textContent = `${product.name} — ${product.price}`;
        list.appendChild(item);
      }
    });
  }

  document.querySelectorAll(".favorite-button").forEach((button) => {
    const isFavorite = favorites.includes(button.dataset.product);
    button.textContent = isFavorite ? "★ Saved" : "☆ Save Favorite";
    button.setAttribute("aria-pressed", String(isFavorite));
  });
}

function toggleFavorite(productId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(productId);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(productId);
  }

  saveFavorites(favorites);
  updateFavoriteDisplay();
}

function setupFavoriteButtons() {
  document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.product);
    });
  });
}

function showValidationMessage(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  if (error) {
    error.textContent = message;
  }
  input.setAttribute("aria-invalid", "true");
}

function clearValidationMessage(input) {
  const error = document.getElementById(`${input.id}-error`);
  if (error) {
    error.textContent = "";
  }
  input.removeAttribute("aria-invalid");
}

function validateContactForm(form) {
  let valid = true;
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const details = document.getElementById("details");

  [name, email, details].forEach(clearValidationMessage);

  if (!name.value.trim()) {
    showValidationMessage(name, "Please enter your name.");
    valid = false;
  } else if (name.value.trim().length < 2) {
    showValidationMessage(name, "Name must be at least 2 characters.");
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showValidationMessage(email, "Please enter your email address.");
    valid = false;
  } else if (!emailPattern.test(email.value.trim())) {
    showValidationMessage(email, "Please enter a valid email address.");
    valid = false;
  }

  if (!details.value.trim()) {
    showValidationMessage(details, "Please describe the item or question you have.");
    valid = false;
  } else if (details.value.trim().length < 10) {
    showValidationMessage(details, "Please enter at least 10 characters.");
    valid = false;
  }

  if (!valid) {
    form.querySelector('[aria-invalid="true"]')?.focus();
  }

  return valid;
}

function setupContactForm() {
  const form = document.getElementById("preorder-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    if (!validateContactForm(form)) {
      event.preventDefault();
    }
  });

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => clearValidationMessage(input));
  });
}

function loadSavedPreferences() {
  updateFavoriteDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  setupFavoriteButtons();
  setupContactForm();
  loadSavedPreferences();
});
