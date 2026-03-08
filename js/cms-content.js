(function () {
  const ASSET_BINDINGS = [
    { key: "hero.logo", selector: ".hero-logo img" },
    { key: "about.gallery.1", selector: ".about-images .about-image:nth-child(1) img" },
    { key: "about.gallery.2", selector: ".about-images .about-image:nth-child(2) img" },
    { key: "about.gallery.3", selector: ".about-images .about-image:nth-child(3) img" },
    { key: "about.gallery.4", selector: ".about-images .about-image:nth-child(4) img" },
    { key: "about.gallery.5", selector: ".about-images .about-image:nth-child(5) img" },
    { key: "about.gallery.6", selector: ".about-images .about-image:nth-child(6) img" }
  ];

  const SERVICE_IMAGE_KEYS = {
    planning: "services.planning.image",
    technical: "services.technical.image",
    streaming: "services.streaming.image",
    prizes: "services.prizes.image",
    marketing: "services.marketing.image",
    judging: "services.judging.image"
  };

  let tournamentsCache = [];

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizeFit(value) {
    const fit = String(value || "").toLowerCase();
    return ["cover", "contain", "fill"].includes(fit) ? fit : "cover";
  }

  function rebuildTournamentModalShell() {
    const modal = document.getElementById("tournament-modal");
    if (!modal) return;

    modal.className = "service-modal";
    modal.innerHTML = `
      <div class="service-modal-overlay"></div>
      <div class="service-modal-container tournament-modal-container">
        <div class="service-modal-main">
          <div class="service-modal-media">
            <img id="modal-tournament-image" src="" alt="Tournament Image" class="service-modal-img">
          </div>
          <div class="service-modal-content">
            <div class="service-modal-header">
              <h2 id="modal-tournament-title" class="service-modal-title"></h2>
              <span id="modal-tournament-subtitle" class="service-modal-subtitle"></span>
            </div>
            <div class="service-modal-description">
              <p id="modal-tournament-description" class="service-modal-text"></p>
            </div>
            <div class="tournament-modal-details">
              <h3>Детали турнира</h3>
              <div class="detail-item">
                <span class="detail-label">Призовой фонд:</span>
                <span id="modal-prize-pool" class="detail-value"></span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Формат:</span>
                <span id="modal-format" class="detail-value"></span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Дата проведения:</span>
                <span id="modal-date" class="detail-value"></span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Количество команд:</span>
                <span id="modal-teams" class="detail-value"></span>
              </div>
            </div>
            <div id="modal-tournament-tags" class="modal-tags" style="display:none;"></div>
          </div>
        </div>
        <button class="service-modal-close" id="tournament-modal-close">
          <span class="close-icon">✕</span>
          ЗАКРЫТЬ
        </button>
      </div>
    `;

    const close = () => {
      modal.classList.remove("active");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
      if (typeof window.lenisStart === "function") window.lenisStart();
    };

    const closeBtn = modal.querySelector("#tournament-modal-close");
    const overlay = modal.querySelector(".service-modal-overlay");
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
  }

  function applyAssets(assets) {
    ASSET_BINDINGS.forEach((binding) => {
      const element = document.querySelector(binding.selector);
      const asset = assets[binding.key];
      if (!element || !asset || !asset.url) return;
      element.src = asset.url;
      if (asset.alt) element.alt = asset.alt;
    });

    const serviceCards = document.querySelectorAll(".service-modal-trigger[data-service-id]");
    serviceCards.forEach((card) => {
      const id = card.getAttribute("data-service-id");
      const key = SERVICE_IMAGE_KEYS[id];
      if (!key) return;
      const asset = assets[key];
      if (asset && asset.url) {
        card.setAttribute("data-image", asset.url);
      }
    });
  }

  function attachTournamentHandlers() {
    const cards = document.querySelectorAll(".tournament-card");
    cards.forEach((card, index) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        if (typeof window.showTournamentModal === "function") {
          window.showTournamentModal("", "", index);
        }
      });
    });
  }

  function renderTournaments(data) {
    const carousel = document.getElementById("tournaments-carousel");
    if (!carousel) return;

    const list = Array.isArray(data.tournaments) ? data.tournaments : [];
    if (!list.length) return;
    tournamentsCache = list;

    const fallbackCover = data.assets?.["tournaments.defaultCover"]?.url || "";

    carousel.innerHTML = list
      .map((item) => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        const image = item.image_url || fallbackCover;
        const imageFit = normalizeFit(item.image_fit);
        return `
          <div class="tournament-card">
            <div class="tournament-image">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: ${escapeHtml(imageFit)};" draggable="false">
            </div>
            <div class="tournament-tags">
              ${tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <h3 class="tournament-title">${escapeHtml(item.title)}</h3>
            <p class="tournament-description">${escapeHtml(item.short_description)}</p>
          </div>
        `;
      })
      .join("");

    attachTournamentHandlers();
  }

  function patchTournamentModal() {
    const original = window.showTournamentModal;
    window.showTournamentModal = function showTournamentModalPatched(_title, _description, index) {
      if (!tournamentsCache.length) {
        if (typeof original === "function") return original(_title, _description, index);
        return;
      }

      const tournament = tournamentsCache[index] || tournamentsCache[0];
      const modal = document.getElementById("tournament-modal");
      if (!modal) return;

      const modalTitle = document.getElementById("modal-tournament-title");
      const modalSubtitle = document.getElementById("modal-tournament-subtitle");
      const modalDescription = document.getElementById("modal-tournament-description");
      const modalImage = document.getElementById("modal-tournament-image");
      const modalTags = document.getElementById("modal-tournament-tags");
      const modalPrizePool = document.getElementById("modal-prize-pool");
      const modalFormat = document.getElementById("modal-format");
      const modalDate = document.getElementById("modal-date");
      const modalTeams = document.getElementById("modal-teams");

      const tags = Array.isArray(tournament.tags) ? tournament.tags : [];
      const subtitle = String(tournament.modal_subtitle || "").trim();

      if (modalTitle) modalTitle.textContent = tournament.title || "";
      if (modalSubtitle) modalSubtitle.textContent = subtitle || tags.slice(0, 2).join(" / ").toUpperCase();
      if (modalDescription) {
        modalDescription.textContent = tournament.modal_description || tournament.short_description || "";
      }
      if (modalImage) {
        const primaryImage = tournament.modal_image_url || tournament.image_url || "";
        const fallbackImage = tournament.image_url || "/assets/webp/69.webp";
        modalImage.src = primaryImage || fallbackImage;
        modalImage.style.objectFit = normalizeFit(tournament.image_fit);
        modalImage.onerror = () => {
          modalImage.onerror = null;
          modalImage.src = fallbackImage;
        };
      }
      if (modalTags) {
        modalTags.innerHTML = tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
      }

      if (modalPrizePool) modalPrizePool.textContent = tournament.prize_pool || "-";
      if (modalFormat) modalFormat.textContent = tournament.tournament_format || "-";
      if (modalDate) modalDate.textContent = tournament.season || "-";
      if (modalTeams) modalTeams.textContent = tournament.teams || "-";

      modal.style.display = "flex";
      modal.classList.add("active");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      if (typeof window.lenisStop === "function") window.lenisStop();
    };
  }

  async function loadContent() {
    try {
      const response = await fetch("/api/public/content", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      if (!data || typeof data !== "object") return;
      applyAssets(data.assets || {});
      renderTournaments(data);
    } catch (error) {
      console.warn("CMS content load skipped", error);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    rebuildTournamentModalShell();
    patchTournamentModal();
    await loadContent();
  });
})();
