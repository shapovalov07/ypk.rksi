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

const footerDownload = document.querySelector(".footer-download");

if (footerDownload instanceof HTMLButtonElement) {
  footerDownload.addEventListener("click", () => {
    const downloadUrl = footerDownload.dataset.downloadUrl;
    const downloadName = footerDownload.dataset.downloadName || "";

    if (!downloadUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = downloadName;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
  });
}
