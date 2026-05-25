const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

const serviceBuilder = document.querySelector("#service-builder");
const builderOutput = document.querySelector("#builder-output");
const builderToRequestLink = document.querySelector('.builder-result a[href="#request"]');
const requestForm = document.querySelector("#request-form");
const formNote = document.querySelector("#form-note");
const requestTypeInputs = requestForm
  ? [...requestForm.querySelectorAll('input[name="type"]')]
  : [];

function getSelectedBuilderServices() {
  if (!serviceBuilder) return [];

  return [...serviceBuilder.querySelectorAll("input:checked")].map((input) => input.value);
}

function getSelectedBuilderKeys() {
  if (!serviceBuilder) return [];

  return [...serviceBuilder.querySelectorAll("input:checked")]
    .map((input) => input.dataset.service)
    .filter(Boolean);
}

function syncRequestTypes(selectedKeys) {
  if (!requestTypeInputs.length) return;

  requestTypeInputs.forEach((input) => {
    input.checked = selectedKeys.includes(input.dataset.service);
  });
}

function syncRequestTypesFromBuilder() {
  const selectedKeys = getSelectedBuilderKeys();
  syncRequestTypes(selectedKeys);
  return getSelectedBuilderServices();
}

function updateBuilderOutput() {
  if (!serviceBuilder || !builderOutput) return;

  const selected = syncRequestTypesFromBuilder();

  if (!selected.length) {
    builderOutput.textContent =
      "Нужна консультация УПК РКСИ: расскажем, какой формат подойдет под вашу задачу.";
    return;
  }

  const text = selected.join(", ");
  builderOutput.textContent = `Нужны работы: ${text}. Команда УПК РКСИ подготовит бриф, оценит объем и предложит план запуска.`;
}

serviceBuilder?.addEventListener("change", updateBuilderOutput);
builderToRequestLink?.addEventListener("click", syncRequestTypesFromBuilder);
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#request") {
    syncRequestTypesFromBuilder();
  }
});
updateBuilderOutput();

requestForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formNote || !(requestForm instanceof HTMLFormElement)) return;

  const formData = new FormData(requestForm);
  const name = String(formData.get("name") || "Заказчик").trim();
  const contact = String(formData.get("contact") || "контакт не указан").trim();
  const type = formData.getAll("type").map((value) => String(value).trim()).filter(Boolean);
  const message = String(formData.get("message") || "задача будет уточнена на брифе").trim();

  formNote.classList.add("ready");
  formNote.textContent = `Заявка: ${name}, ${contact}. Тип проекта: ${type.length ? type.join(", ") : "формат не выбран"}. Задача: ${message}`;
});
