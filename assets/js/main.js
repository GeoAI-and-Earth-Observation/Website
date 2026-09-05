(() => {
  const data = window.siteData || null;

  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();

  const renderResearch = () => {
    document.querySelector("#research-grid").innerHTML = data.researchThemes.map((item, index) => `
      <article class="research-card" data-index="${String(index + 1).padStart(2, "0")}">
        <div class="research-icon" aria-hidden="true">${item.icon}</div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </article>
    `).join("");
  };

  const renderPeopleFilters = () => {
    const filters = ["All", ...new Set(data.people.map(person => person.role))];
    const target = document.querySelector("#people-filters");
    target.innerHTML = filters.map((filter, index) => `
      <button class="filter-button${index === 0 ? " active" : ""}" type="button" data-filter="${filter}">
        ${filter}
      </button>
    `).join("");

    target.addEventListener("click", event => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      target.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderPeople(button.dataset.filter);
    });
  };

  const renderPeople = (filter = "All") => {
    const filtered = filter === "All" ? data.people : data.people.filter(person => person.role === filter);
    document.querySelector("#people-grid").innerHTML = filtered.map(person => `
      <article class="person-card">
        <div class="person-image" aria-hidden="true">
          ${person.image
            ? `<img src="${person.image}" alt="" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('image-fallback'); this.parentElement.textContent='${initials(person.name)}';">`
            : initials(person.name)}
        </div>
        <div class="person-body">
          <div class="person-role">${person.role}</div>
          <h3>${person.name}</h3>
          <p><strong>${person.title}</strong><br>${person.interests}</p>
          <a class="text-link" href="${person.url}">View profile <span aria-hidden="true">→</span></a>
        </div>
      </article>
    `).join("");
  };

  const renderPublications = () => {
    document.querySelector("#publication-list").innerHTML = data.publications.map(item => `
      <article class="publication-item">
        <div class="publication-year">${item.year}</div>
        <div>
          <h3><a href="${item.url}">${item.title}</a></h3>
          <p>${item.citation}</p>
        </div>
        <div class="publication-type">${item.type}</div>
      </article>
    `).join("");
  };

  const NEWS_PAGE_SIZE = 6;

  const renderNews = (requestedPage = 1) => {
    const pageCount = Math.ceil(data.news.length / NEWS_PAGE_SIZE);
    const page = Math.min(Math.max(requestedPage, 1), pageCount);
    const startIndex = (page - 1) * NEWS_PAGE_SIZE;
    const visibleNews = data.news.slice(startIndex, startIndex + NEWS_PAGE_SIZE);

    document.querySelector("#news-grid").innerHTML = visibleNews.map(item => `
      <article class="news-card">
        <div class="news-meta">
          <span class="news-type">${item.type}</span>
          <span aria-hidden="true">·</span>
          <time>${item.date}</time>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <a class="text-link" href="${item.url}">${item.linkLabel || "Read update"} <span aria-hidden="true">→</span></a>
      </article>
    `).join("");

    const pagination = document.querySelector("#news-pagination");
    pagination.hidden = pageCount <= 1;
    pagination.innerHTML = Array.from({ length: pageCount }, (_, index) => {
      const pageNumber = index + 1;
      const isCurrent = pageNumber === page;
      return `<button class="page-button${isCurrent ? " active" : ""}" type="button" data-page="${pageNumber}" aria-label="Show news page ${pageNumber}"${isCurrent ? ' aria-current="page"' : ""}>${pageNumber}</button>`;
    }).join("");
  };

  const setupNewsPagination = () => {
    document.querySelector("#news-pagination").addEventListener("click", event => {
      const button = event.target.closest("button[data-page]");
      if (!button) return;
      renderNews(Number(button.dataset.page));
      document.querySelector("#news").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const setupNavigation = () => {
    const button = document.querySelector(".menu-button");
    const nav = document.querySelector(".site-nav");

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", event => {
      if (!event.target.closest("a")) return;
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
    });
  };

  if (data && document.querySelector("#research-grid")) renderResearch();
  if (data && document.querySelector("#people-filters")) renderPeopleFilters();
  if (data && document.querySelector("#people-grid")) renderPeople();
  if (data && document.querySelector("#publication-list")) renderPublications();
  if (data && document.querySelector("#news-grid")) {
    renderNews();
    setupNewsPagination();
  }
  setupNavigation();
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
