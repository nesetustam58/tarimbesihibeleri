/**
 * AgroGrant Dashboard - Main Application Controller
 * Handles UI state, filtering, slide-over drawers, DSHD reports, and AI chat.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentView: "all", // "all", "closing", "dshd", "sources"
    filterStatus: "all",
    filterAgency: "all",
    filterCategory: "all",
    searchQuery: "",
    selectedGrant: null,
    chatMessages: [],
    isAiBusy: false,
    grants: [...window.AGRO_GRANTS],
    sources: [...window.AGRO_SOURCES]
  };

  // DOM Elements Cache
  const elements = {
    // Navigation
    navLinks: document.querySelectorAll("[data-nav-view]"),
    pageTitle: document.getElementById("page-title"),
    pageSubtitle: document.getElementById("page-subtitle"),
    
    // Views
    grantsView: document.getElementById("grants-view"),
    sourcesView: document.getElementById("sources-view"),
    dshdView: document.getElementById("dshd-view"),
    
    // Containers
    grantsGrid: document.getElementById("grants-grid"),
    sourcesTableBody: document.getElementById("sources-table-body"),
    dshdListContainer: document.getElementById("dshd-list-container"),
    grantsCount: document.getElementById("grants-count"),
    
    // Filters & Search
    searchInput: document.getElementById("search-input"),
    filterAgency: document.getElementById("filter-agency"),
    filterCategory: document.getElementById("filter-category"),
    filterStatusPills: document.querySelectorAll("[data-status-filter]"),
    resetFiltersBtn: document.getElementById("btn-reset-filters"),

    // AI Drawer
    aiDrawer: document.getElementById("ai-drawer"),
    aiDrawerBackdrop: document.getElementById("ai-drawer-backdrop"),
    aiDrawerClose: document.getElementById("btn-close-ai-drawer"),
    aiChatContainer: document.getElementById("ai-chat-messages"),
    aiChatInput: document.getElementById("ai-chat-input"),
    aiChatSendBtn: document.getElementById("btn-send-ai-chat"),
    aiCurrentGrantBadge: document.getElementById("ai-current-grant-badge"),
    aiQuickPrompts: document.getElementById("ai-quick-prompts"),
    aiActiveProviderBadge: document.getElementById("ai-active-provider-badge"),

    // DSHD Modal
    dshdModal: document.getElementById("dshd-modal"),
    dshdModalClose: document.getElementById("btn-close-dshd-modal"),
    dshdModalTitle: document.getElementById("dshd-modal-title"),
    dshdModalAgency: document.getElementById("dshd-modal-agency"),
    dshdModalScore: document.getElementById("dshd-modal-score"),
    dshdModalRiskBadge: document.getElementById("dshd-modal-risk"),
    dshdModalLegals: document.getElementById("dshd-modal-legals"),
    dshdModalWarnings: document.getElementById("dshd-modal-warnings"),
    dshdModalTimeline: document.getElementById("dshd-modal-timeline"),
    dshdModalLinks: document.getElementById("dshd-modal-links"),
    dshdAskAiBtn: document.getElementById("btn-dshd-ask-ai"),

    // Settings Modal
    settingsModal: document.getElementById("settings-modal"),
    settingsBtn: document.getElementById("btn-open-settings"),
    settingsCloseBtn: document.getElementById("btn-close-settings"),
    settingsSaveBtn: document.getElementById("btn-save-settings"),
    settingProviderSelect: document.getElementById("setting-provider"),
    settingApiKey: document.getElementById("setting-api-key"),
    settingModel: document.getElementById("setting-model"),
    settingBaseUrl: document.getElementById("setting-base-url"),
    apiKeyGroup: document.getElementById("api-key-group"),
    baseUrlGroup: document.getElementById("base-url-group"),

    // Add Source Modal
    addSourceModal: document.getElementById("add-source-modal"),
    btnAddSource: document.getElementById("btn-add-source"),
    btnCloseAddSource: document.getElementById("btn-close-add-source"),
    btnSaveSource: document.getElementById("btn-save-source"),
    newSourceName: document.getElementById("new-source-name"),
    newSourceUrl: document.getElementById("new-source-url"),
    newSourceType: document.getElementById("new-source-type"),

    // Mobile Sidebar
    mobileMenuBtn: document.getElementById("btn-mobile-menu"),
    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebar-overlay")
  };

  /**
   * INITIALIZATION
   */
  function init() {
    setupEventListeners();
    populateCategoryOptions();
    updateAIProviderBadge();
    renderGrants();
    renderSources();
    renderDSHDHub();
  }

  /**
   * POPULATE FILTER DROPDOWNS
   */
  function populateCategoryOptions() {
    const categories = Array.from(new Set(state.grants.map(g => g.category)));
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      elements.filterCategory.appendChild(opt);
    });
  }

  /**
   * EVENT LISTENERS
   */
  function setupEventListeners() {
    // Navigation Views
    elements.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.getAttribute("data-nav-view");
        switchView(view);
      });
    });

    // Mobile Sidebar Toggle
    if (elements.mobileMenuBtn) {
      elements.mobileMenuBtn.addEventListener("click", () => {
        elements.sidebar.classList.toggle("-translate-x-full");
        elements.sidebarOverlay.classList.toggle("hidden");
      });
    }
    if (elements.sidebarOverlay) {
      elements.sidebarOverlay.addEventListener("click", () => {
        elements.sidebar.classList.add("-translate-x-full");
        elements.sidebarOverlay.classList.add("hidden");
      });
    }

    // Search Input
    elements.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderGrants();
    });

    // Agency Filter
    elements.filterAgency.addEventListener("change", (e) => {
      state.filterAgency = e.target.value;
      renderGrants();
    });

    // Category Filter
    elements.filterCategory.addEventListener("change", (e) => {
      state.filterCategory = e.target.value;
      renderGrants();
    });

    // Status Pills
    elements.filterStatusPills.forEach(pill => {
      pill.addEventListener("click", () => {
        elements.filterStatusPills.forEach(p => {
          p.classList.remove("bg-blue-50", "text-blue-700", "border-blue-300", "font-medium");
          p.classList.add("bg-white", "text-gray-600", "border-gray-200");
        });
        pill.classList.remove("bg-white", "text-gray-600", "border-gray-200");
        pill.classList.add("bg-blue-50", "text-blue-700", "border-blue-300", "font-medium");

        state.filterStatus = pill.getAttribute("data-status-filter");
        renderGrants();
      });
    });

    // Reset Filters
    elements.resetFiltersBtn.addEventListener("click", () => {
      state.searchQuery = "";
      state.filterStatus = "all";
      state.filterAgency = "all";
      state.filterCategory = "all";

      elements.searchInput.value = "";
      elements.filterAgency.value = "all";
      elements.filterCategory.value = "all";

      elements.filterStatusPills.forEach(p => {
        const isAll = p.getAttribute("data-status-filter") === "all";
        p.className = isAll
          ? "px-3 py-1.5 text-xs rounded-full border border-blue-300 bg-blue-50 text-blue-700 font-medium transition cursor-pointer"
          : "px-3 py-1.5 text-xs rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition cursor-pointer";
      });

      renderGrants();
    });

    // AI Drawer Events
    elements.aiDrawerClose.addEventListener("click", closeAiDrawer);
    elements.aiDrawerBackdrop.addEventListener("click", closeAiDrawer);
    elements.aiChatSendBtn.addEventListener("click", handleSendChatMessage);
    elements.aiChatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendChatMessage();
      }
    });

    // Quick Prompts Click Delegation
    elements.aiQuickPrompts.addEventListener("click", (e) => {
      const target = e.target.closest("[data-prompt]");
      if (target) {
        const promptText = target.getAttribute("data-prompt");
        sendUserMessage(promptText);
      }
    });

    // DSHD Modal Events
    elements.dshdModalClose.addEventListener("click", closeDshdModal);
    elements.dshdAskAiBtn.addEventListener("click", () => {
      closeDshdModal();
      if (state.selectedGrant) {
        openAiDrawer(state.selectedGrant);
        sendUserMessage(`Bu çağrının (${state.selectedGrant.title}) DSHD denetim raporundaki hukuki ve bürokratik risklerini detaylıca açıklar mısın?`);
      }
    });

    // Settings Modal
    elements.settingsBtn.addEventListener("click", openSettingsModal);
    elements.settingsCloseBtn.addEventListener("click", closeSettingsModal);
    elements.settingProviderSelect.addEventListener("change", handleProviderChangeInSettings);
    elements.settingsSaveBtn.addEventListener("click", handleSaveSettings);

    // Add Source Modal
    elements.btnAddSource.addEventListener("click", () => elements.addSourceModal.classList.add("active"));
    elements.btnCloseAddSource.addEventListener("click", () => elements.addSourceModal.classList.remove("active"));
    elements.btnSaveSource.addEventListener("click", handleSaveNewSource);
  }

  /**
   * VIEW SWITCHING
   */
  function switchView(view) {
    state.currentView = view;

    // Update Nav Link Active states
    elements.navLinks.forEach(link => {
      const isTarget = link.getAttribute("data-nav-view") === view;
      if (isTarget) {
        link.classList.add("bg-blue-50", "text-blue-700", "font-semibold");
        link.classList.remove("text-gray-700", "hover:bg-gray-100");
      } else {
        link.classList.remove("bg-blue-50", "text-blue-700", "font-semibold");
        link.classList.add("text-gray-700", "hover:bg-gray-100");
      }
    });

    // Hide all view containers
    elements.grantsView.classList.add("hidden");
    elements.sourcesView.classList.add("hidden");
    elements.dshdView.classList.add("hidden");

    if (view === "all") {
      elements.grantsView.classList.remove("hidden");
      elements.pageTitle.textContent = "Tüm Hibe & Destek Çağrıları";
      elements.pageSubtitle.textContent = "Ulusal ve uluslararası tarım, hayvancılık ve kırsal kalkınma çağrıları";
      state.filterStatus = "all";
      renderGrants();
    } else if (view === "closing") {
      elements.grantsView.classList.remove("hidden");
      elements.pageTitle.textContent = "Süresi Dolmaya Yaklaşan Çağrılar";
      elements.pageSubtitle.textContent = "Son başvuru tarihine 30 günden az kalan kritik çağrılar";
      state.filterStatus = "closing_soon";
      renderGrants();
    } else if (view === "sources") {
      elements.sourcesView.classList.remove("hidden");
      elements.pageTitle.textContent = "Kaynaklar & Veri Tarayıcıları";
      elements.pageSubtitle.textContent = "Otomatik taranan resmi kurum portalları ve asenkron scraper durumları";
      renderSources();
    } else if (view === "dshd") {
      elements.dshdView.classList.remove("hidden");
      elements.pageTitle.textContent = "DSHD Değerlendirme Raporları Merkezi";
      elements.pageSubtitle.textContent = "Tüm çağrılar için hazırlanmış çapraz hukuki ve operasyonel denetim analizleri";
      renderDSHDHub();
    }
  }

  /**
   * RENDER GRANTS
   */
  function renderGrants() {
    const filtered = state.grants.filter(grant => {
      // Status filter
      if (state.filterStatus !== "all" && grant.status !== state.filterStatus) {
        return false;
      }
      // Agency filter
      if (state.filterAgency !== "all") {
        if (state.filterAgency === "tkdk" && !grant.agency.includes("TKDK")) return false;
        if (state.filterAgency === "tarim" && !grant.agency.includes("Tarım ve Orman")) return false;
        if (state.filterAgency === "ab" && !grant.agency.includes("Avrupa")) return false;
        if (state.filterAgency === "fao" && !grant.agency.includes("FAO")) return false;
      }
      // Category filter
      if (state.filterCategory !== "all" && grant.category !== state.filterCategory) {
        return false;
      }
      // Search query
      if (state.searchQuery) {
        const fullText = `${grant.title} ${grant.agency} ${grant.summary} ${grant.tags.join(" ")}`.toLowerCase();
        if (!fullText.includes(state.searchQuery)) return false;
      }
      return true;
    });

    elements.grantsCount.textContent = `${filtered.length} Çağrı Bulundu`;

    if (filtered.length === 0) {
      elements.grantsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-base font-medium text-gray-800">Aramanıza uygun çağrı bulunamadı</h3>
          <p class="text-xs text-gray-500 mt-1">Filtreleri temizleyerek veya farklı arama kelimeleri deneyerek tekrar arayabilirsiniz.</p>
        </div>
      `;
      return;
    }

    elements.grantsGrid.innerHTML = filtered.map(grant => {
      const statusBadge = getStatusBadgeHtml(grant.status, grant.statusLabel);
      const isUrgent = grant.status === "closing_soon";

      return `
        <div class="google-card p-5 flex flex-col justify-between hover:border-blue-400 group">
          <div>
            <!-- Top Badges & Agency -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded bg-gray-100 text-gray-700">
                ${grant.code}
              </span>
              ${statusBadge}
            </div>

            <!-- Title & Agency -->
            <h3 class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition leading-snug line-clamp-2 mb-1">
              ${grant.title}
            </h3>
            <p class="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              ${grant.agency} &bull; ${grant.location}
            </p>

            <!-- Summary -->
            <p class="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
              ${grant.summary}
            </p>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-3 gap-2 py-2 px-3 bg-gray-50 rounded-lg mb-4 text-center">
              <div>
                <span class="block text-[10px] text-gray-400 font-medium">Hibe Oranı</span>
                <span class="text-xs font-bold text-emerald-600">${grant.rate}</span>
              </div>
              <div class="border-x border-gray-200">
                <span class="block text-[10px] text-gray-400 font-medium">Hibe Tavanı</span>
                <span class="text-xs font-bold text-gray-800">${grant.grantCeiling}</span>
              </div>
              <div>
                <span class="block text-[10px] text-gray-400 font-medium">Kalan Süre</span>
                <span class="text-xs font-bold ${isUrgent ? 'text-amber-600' : 'text-gray-700'}">
                  ${grant.daysLeft > 0 ? `${grant.daysLeft} Gün` : 'Sona Erdi'}
                </span>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${grant.tags.map(tag => `
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  #${tag}
                </span>
              `).join("")}
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button 
              onclick="window.appOpenDshd('${grant.id}')"
              class="px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              DSHD Raporu
            </button>

            <button 
              onclick="window.appOpenAi('${grant.id}')"
              class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition flex items-center gap-1 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              AI Asistanı
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  function getStatusBadgeHtml(status, label) {
    if (status === "active") {
      return `<span class="badge-active text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>${label}
      </span>`;
    } else if (status === "closing_soon") {
      return `<span class="badge-closing text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-dot"></span>${label}
      </span>`;
    } else if (status === "upcoming") {
      return `<span class="badge-upcoming text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>${label}
      </span>`;
    } else {
      return `<span class="badge-expired text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>${label}
      </span>`;
    }
  }

  /**
   * RENDER SOURCES
   */
  function renderSources() {
    elements.sourcesTableBody.innerHTML = state.sources.map((src, index) => {
      const isOnline = src.status === "active";
      return `
        <tr class="hover:bg-gray-50/80 transition">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-900">${src.name}</div>
                <div class="text-xs text-gray-500">${src.type}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <a href="${src.targetUrl}" target="_blank" class="text-xs text-blue-600 hover:underline flex items-center gap-1 max-w-xs truncate">
              ${src.targetUrl}
              <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">
              <span class="w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
              ${src.statusText}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
            ${src.lastRun}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-800">
            ${src.itemsTracked} Çağrı
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-xs">
            <button 
              onclick="window.appToggleSource(${index})"
              class="px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 transition">
              ${isOnline ? 'Duraklat' : 'Aktif Et'}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  /**
   * RENDER DSHD HUB VIEW
   */
  function renderDSHDHub() {
    elements.dshdListContainer.innerHTML = state.grants.map(grant => {
      return `
        <div class="google-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="max-w-2xl">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                ${grant.code}
              </span>
              <span class="text-xs text-gray-500 font-medium">${grant.agency}</span>
            </div>
            <h4 class="text-base font-semibold text-gray-900 mb-1">${grant.title}</h4>
            <p class="text-xs text-gray-600 line-clamp-2 mb-2">${grant.legalRisk}</p>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span>Bürokrasi Skoru: <strong class="text-gray-800">${grant.bureaucracyScore}/10</strong></span>
              <span>&bull;</span>
              <span>Tahmini Süreç: <strong class="text-gray-800">${grant.timelineWeeks}</strong></span>
              <span>&bull;</span>
              <span>Risk: <strong class="${grant.riskLevel.includes('Yüksek') ? 'text-red-600' : 'text-emerald-600'}">${grant.riskLevel}</strong></span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button 
              onclick="window.appOpenDshd('${grant.id}')"
              class="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition shadow-sm flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Raporu Aç & İncele
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  /**
   * AI ASSISTANT DRAWER CONTROLS
   */
  function openAiDrawer(grant) {
    state.selectedGrant = grant;
    elements.aiCurrentGrantBadge.textContent = grant ? grant.title : "Genel Danışmanlık";
    elements.aiDrawerBackdrop.classList.add("active");
    elements.aiDrawer.classList.add("open");

    // Initial greeting if empty
    if (state.chatMessages.length === 0) {
      const initialGreeting = grant
        ? `Merhaba! Ben **AgroGrant AI Hibe Danışmanı**.\n\nŞu anda **"${grant.title}"** çağrısını inceliyorsunuz. Bu hibe için kimlerin başvurabileceği, başvuru evrakları veya proje taslağı hakkında ne öğrenmek istersiniz?`
        : `Merhaba! Ben **AgroGrant AI Hibe Danışmanı**. Tarım ve hayvancılık hibe çağrıları hakkında dilediğinizi sorabilirsiniz.`;

      appendChatMessage("assistant", initialGreeting);
    }
  }

  function closeAiDrawer() {
    elements.aiDrawerBackdrop.classList.remove("active");
    elements.aiDrawer.classList.remove("open");
  }

  async function handleSendChatMessage() {
    const text = elements.aiChatInput.value.trim();
    if (!text || state.isAiBusy) return;
    elements.aiChatInput.value = "";
    await sendUserMessage(text);
  }

  async function sendUserMessage(text) {
    appendChatMessage("user", text);
    state.isAiBusy = true;

    // Show typing placeholder
    const typingId = showTypingIndicator();

    try {
      const adapter = window.agroAI.getAdapter();
      const messagesForApi = state.chatMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await adapter.chat(messagesForApi, state.selectedGrant);
      removeTypingIndicator(typingId);
      appendChatMessage("assistant", response);
    } catch (err) {
      removeTypingIndicator(typingId);
      appendChatMessage("assistant", `⚠️ Bir hata oluştu: ${err.message || "Bilinmeyen AI hatası."}`);
    } finally {
      state.isAiBusy = false;
    }
  }

  function appendChatMessage(role, content) {
    state.chatMessages.push({ role, content });

    const msgDiv = document.createElement("div");
    msgDiv.className = `flex flex-col ${role === "user" ? "items-end" : "items-start"} mb-4`;

    const bubble = document.createElement("div");
    bubble.className = `px-4 py-3 text-xs leading-relaxed max-w-[85%] whitespace-pre-line shadow-sm ${
      role === "user" ? "chat-bubble-user" : "chat-bubble-assistant text-gray-800"
    }`;
    bubble.innerHTML = formatMarkdown(content);

    msgDiv.appendChild(bubble);
    elements.aiChatContainer.appendChild(msgDiv);
    elements.aiChatContainer.scrollTop = elements.aiChatContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const id = "typing-" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "flex items-start mb-4";
    div.innerHTML = `
      <div class="px-4 py-2.5 rounded-2xl bg-gray-100 text-xs text-gray-500 flex items-center gap-1.5 shadow-sm">
        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
        <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
        <span class="ml-1 text-[11px] font-medium text-gray-600">Danışman düşünüyor...</span>
      </div>
    `;
    elements.aiChatContainer.appendChild(div);
    elements.aiChatContainer.scrollTop = elements.aiChatContainer.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-[11px]">$1</code>');
  }

  /**
   * DSHD MODAL CONTROLS
   */
  async function openDshdModal(grant) {
    state.selectedGrant = grant;
    elements.dshdModalTitle.textContent = grant.title;
    elements.dshdModalAgency.textContent = `${grant.agency} &bull; ${grant.code}`;
    elements.dshdModalScore.textContent = `${grant.bureaucracyScore}/10`;

    const isHighRisk = grant.riskLevel.includes("Yüksek");
    elements.dshdModalRiskBadge.textContent = grant.riskLevel;
    elements.dshdModalRiskBadge.className = `px-2.5 py-1 rounded-full text-xs font-semibold ${
      isHighRisk ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
    }`;

    // Generate dynamic or simulated DSHD report
    elements.dshdModalLegals.innerHTML = `<div class="p-3 text-xs text-gray-400">Analiz yükleniyor...</div>`;
    elements.dshdModalWarnings.innerHTML = `<div class="p-3 text-xs text-gray-400">Analiz yükleniyor...</div>`;
    elements.dshdModalTimeline.innerHTML = `<div class="p-3 text-xs text-gray-400">Analiz yükleniyor...</div>`;

    elements.dshdModal.classList.add("active");

    const adapter = window.agroAI.getAdapter();
    const report = await adapter.generateDSHDReport(grant);

    // Populate Legal
    elements.dshdModalLegals.innerHTML = report.legalWatchpoints.map(item => `
      <li class="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
        <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <span>${item}</span>
      </li>
    `).join("");

    // Populate Warnings
    elements.dshdModalWarnings.innerHTML = report.unionWarnings.map(item => `
      <li class="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
        <svg class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${item}</span>
      </li>
    `).join("");

    // Populate Timeline
    elements.dshdModalTimeline.innerHTML = report.timeline.map((step, idx) => `
      <div class="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-gray-50/50">
        <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
          ${idx + 1}
        </span>
        <div class="flex-1">
          <span class="text-xs font-semibold text-gray-800">${step.phase}: ${step.name}</span>
          <span class="block text-[11px] text-gray-500">Öngörülen Süre: ${step.duration} &bull; ${step.status}</span>
        </div>
      </div>
    `).join("");

    // Populate Links
    elements.dshdModalLinks.innerHTML = report.verifiedLinks.map(link => `
      <a href="${link.url}" target="_blank" class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
        ${link.label}
      </a>
    `).join("");
  }

  function closeDshdModal() {
    elements.dshdModal.classList.remove("active");
  }

  /**
   * SETTINGS MODAL & AI CONFIG
   */
  function openSettingsModal() {
    const config = window.agroAI.getConfig();
    elements.settingProviderSelect.value = config.provider;
    elements.settingApiKey.value = config.apiKey;
    elements.settingModel.value = config.model;
    elements.settingBaseUrl.value = config.baseUrl;

    updateSettingsVisibility(config.provider);
    elements.settingsModal.classList.add("active");
  }

  function closeSettingsModal() {
    elements.settingsModal.classList.remove("active");
  }

  function handleProviderChangeInSettings(e) {
    updateSettingsVisibility(e.target.value);
  }

  function updateSettingsVisibility(provider) {
    if (provider === "mock") {
      elements.apiKeyGroup.classList.add("hidden");
      elements.baseUrlGroup.classList.add("hidden");
    } else if (provider === "gemini") {
      elements.apiKeyGroup.classList.remove("hidden");
      elements.baseUrlGroup.classList.add("hidden");
    } else if (provider === "ollama") {
      elements.apiKeyGroup.classList.add("hidden");
      elements.baseUrlGroup.classList.remove("hidden");
    } else {
      elements.apiKeyGroup.classList.remove("hidden");
      elements.baseUrlGroup.classList.remove("hidden");
    }
  }

  function handleSaveSettings() {
    const provider = elements.settingProviderSelect.value;
    const apiKey = elements.settingApiKey.value.trim();
    const model = elements.settingModel.value.trim();
    const baseUrl = elements.settingBaseUrl.value.trim();

    window.agroAI.setProvider(provider, { apiKey, model, baseUrl });
    updateAIProviderBadge();
    closeSettingsModal();
    alert("Yapay zeka ayarları kaydedildi!");
  }

  function updateAIProviderBadge() {
    const config = window.agroAI.getConfig();
    const providerLabels = {
      mock: "Simülatör (Mock)",
      gemini: "Google Gemini 2.5",
      openai: "LiteLLM / OpenRouter",
      ollama: "Ollama (Yerel)"
    };
    elements.aiActiveProviderBadge.textContent = providerLabels[config.provider] || config.provider;
  }

  /**
   * ADD NEW SOURCE
   */
  function handleSaveNewSource() {
    const name = elements.newSourceName.value.trim();
    const url = elements.newSourceUrl.value.trim();
    const type = elements.newSourceType.value;

    if (!name || !url) {
      alert("Lütfen kaynak adı ve URL alanlarını doldurun.");
      return;
    }

    state.sources.push({
      id: "src-" + Date.now(),
      name,
      type,
      targetUrl: url,
      status: "active",
      lastRun: "Şimdi eklendi",
      itemsTracked: 0,
      statusText: "Yeni / Beklemede",
      scraperMethod: "Asenkron Web Scraper",
      refreshInterval: "1 Saat"
    });

    elements.newSourceName.value = "";
    elements.newSourceUrl.value = "";
    elements.addSourceModal.classList.remove("active");
    renderSources();
  }

  // Global helper functions attached to window for inline onclick handlers
  window.appOpenAi = (grantId) => {
    const grant = state.grants.find(g => g.id === grantId);
    openAiDrawer(grant);
  };

  window.appOpenDshd = (grantId) => {
    const grant = state.grants.find(g => g.id === grantId);
    if (grant) openDshdModal(grant);
  };

  window.appToggleSource = (index) => {
    const src = state.sources[index];
    if (src) {
      src.status = src.status === "active" ? "paused" : "active";
      src.statusText = src.status === "active" ? "Sağlıklı (200 OK)" : "Duraklatıldı";
      renderSources();
    }
  };

  // Start the application
  init();
});
