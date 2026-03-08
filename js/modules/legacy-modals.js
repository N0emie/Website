(function () {
  function createExampFloatingDots() {
    const container = document.getElementById("exampFloatingDots");
    if (!container) return;

    setInterval(() => {
      const dot = document.createElement("div");
      dot.className = "examp-dot";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.animationDelay = Math.random() * 2 + "s";
      dot.style.animationDuration = 15 + Math.random() * 10 + "s";

      container.appendChild(dot);
      setTimeout(() => {
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      }, 25000);
    }, 300);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // createExampFloatingDots();

    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen");
      if (!loadingScreen) return;
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 2000);
  });

  window.showTournamentModal = function showTournamentModal(title, description, index) {
    const modal = document.getElementById("tournament-modal");
    const modalTitle = document.getElementById("modal-tournament-title");
    const modalDescription = document.getElementById("modal-tournament-description");
    if (!modal || !modalTitle || !modalDescription) return;

    const tournaments = [
      {
        title: "VOLT ENERGY CYBER CUP",
        description: "Tournament by Dota 2 with prize pool 5,000,000 rubles",
        prizePool: "5,000,000?",
        format: "Single Elimination",
        date: "15-20 December 2024",
        teams: "16 teams",
        tags: ["Professional", "Dota 2", "Online"]
      },
      {
        title: "WINLINE STAR SERIES CS2",
        description: "Professional CS2 series by Winline. Prize pool 1,200,000 rubles",
        prizePool: "1,200,000?",
        format: "Swiss System + Playoffs",
        date: "10-15 January 2025",
        teams: "24 teams",
        tags: ["Professional", "CS2", "Offline"]
      },
      {
        title: "DOTA2 CHAMPIONS",
        description: "Dota 2 regional championship",
        prizePool: "2,500,000?",
        format: "Double Elimination",
        date: "1-10 February 2025",
        teams: "12 teams",
        tags: ["Professional", "Championship", "Offline"]
      },
      {
        title: "MOBILE ESPORTS FEST",
        description: "Mobile esports festival with tournaments",
        prizePool: "800,000?",
        format: "Round Robin",
        date: "20-25 March 2025",
        teams: "20 teams",
        tags: ["Mobile", "Festival", "Online"]
      }
    ];

    const tournament = tournaments[index] || tournaments[0];
    modalTitle.textContent = tournament.title;
    modalDescription.textContent = tournament.description;

    const modalTags = document.getElementById("modal-tournament-tags");
    const modalPrizePool = document.getElementById("modal-prize-pool");
    const modalFormat = document.getElementById("modal-format");
    const modalDate = document.getElementById("modal-date");
    const modalTeams = document.getElementById("modal-teams");

    if (modalTags) {
      modalTags.innerHTML = tournament.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
    }
    if (modalPrizePool) modalPrizePool.textContent = tournament.prizePool;
    if (modalFormat) modalFormat.textContent = tournament.format;
    if (modalDate) modalDate.textContent = tournament.date;
    if (modalTeams) modalTeams.textContent = tournament.teams;

    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    if (typeof window.lenisStop === "function") window.lenisStop();
  };

  function closeTournamentModal() {
    const modal = document.getElementById("tournament-modal");
    if (!modal) return;
    modal.classList.remove("active");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    if (typeof window.lenisStart === "function") window.lenisStart();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("tournament-modal");
    const closeButton = document.querySelector(".modal-close");

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains("modal-overlay")) {
          closeTournamentModal();
        }
      });
    }

    if (closeButton) closeButton.addEventListener("click", closeTournamentModal);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("new-service-modal");
    const modalImage = document.getElementById("new-service-modal-image");
    const modalTitle = document.getElementById("new-service-modal-title");
    const modalSubtitle = document.getElementById("new-service-modal-subtitle");
    const modalText = document.getElementById("new-service-modal-text");
    const modalClose = document.getElementById("new-service-modal-close");
    const modalOverlay = document.querySelector(".service-modal-overlay");
    const serviceTriggers = document.querySelectorAll(".service-modal-trigger");
    const modalContainer = document.querySelector(".service-modal-container");

    if (!modal || !modalImage || !modalTitle || !modalSubtitle || !modalText || !modalClose || !modalOverlay || !modalContainer) {
      return;
    }

    const fallbackImages = {
      planning: "assets/images/tournaments/csgo-tournament.jpg",
      technical: "assets/images/tournaments/dota2-championship.jpg",
      streaming: "assets/images/tournaments/valorant-cup.jpg",
      prizes: "assets/images/tournament-cards/volt-energy-cup.jpg",
      marketing: "assets/images/tournament-cards/winline-cs2.jpg",
      judging: "assets/images/tournament-cards/dota2-champions.jpg"
    };

    function openServiceModal(serviceData) {
      const imageSrc = serviceData.image || fallbackImages[serviceData.serviceId] || "assets/webp/69.webp";

      modalImage.src = imageSrc;
      modalImage.alt = serviceData.title || "";
      modalTitle.textContent = serviceData.title || "";
      modalSubtitle.textContent = serviceData.subtitle || "";
      modalText.textContent = serviceData.description || "";

      modal.style.display = "flex";
      document.body.classList.add("modal-open");

      setTimeout(() => modal.classList.add("active"), 10);
      if (typeof window.lenisStop === "function") window.lenisStop();
    }

    function closeServiceModal() {
      modal.classList.remove("active");
      modal.classList.add("closing");

      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("closing");
        document.body.classList.remove("modal-open");
        if (typeof window.lenisStart === "function") window.lenisStart();
      }, 300);
    }

    serviceTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
        openServiceModal({
          serviceId: this.dataset.serviceId,
          title: this.dataset.title,
          subtitle: this.dataset.subtitle,
          image: this.dataset.image,
          description: this.dataset.description
        });
      });
    });

    modalClose.addEventListener("click", closeServiceModal);
    modalOverlay.addEventListener("click", closeServiceModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeServiceModal();
      }
    });
    modalContainer.addEventListener("click", (e) => e.stopPropagation());
  });
})();
