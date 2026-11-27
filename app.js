(function () {
  const skills = window.TEACHER_SKILLS || [];

  const PAGE_META = [
    { id: "overview", label: "總覽｜手冊導讀與技能地圖" },
    { id: "ch1", label: "第 1 章｜認識 Antigravity 與安裝入門" },
    { id: "ch2", label: "第 2 章｜必裝 MCP 與外掛設定攻略" },
    { id: "ch3", label: "第 3 章｜國語出題、作文診斷／紅筆批改與發布" },
    { id: "ch4", label: "第 4 章｜說數學與上台發表影音批改" },
    { id: "ch5", label: "第 5 章｜社會 4F 反思與題庫資料庫" },
    { id: "ch6", label: "第 6 章｜數學遊戲吧與開發提示詞攻略" },
    { id: "ch7", label: "第 7 章｜導師輔導紀錄與系統同步" },
    { id: "ch8", label: "第 8 章｜智慧班級經營工具箱（存摺・點歌・盤點）" },
    { id: "ch9", label: "第 9 章｜技能複製、備份與推廣避坑清單" },
    { id: "conclusion", label: "結語｜把教學想像真正化為現實" }
  ];

  let currentPageId = "overview";

  // Clipboard helper with fallback for file:// URLs
  async function copyText(text, btn) {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (_) {}
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch (_) {}
      document.body.removeChild(ta);
    }
    if (btn && ok) {
      const prev = btn.textContent;
      btn.textContent = "✓ 已複製！";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = prev;
        btn.classList.remove("copied");
      }, 1800);
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Render skill cards into their chapter containers
  function renderChapterSkills() {
    const containers = document.querySelectorAll("[data-skill-chapter]");
    containers.forEach((box) => {
      const ch = box.getAttribute("data-skill-chapter");
      const list = skills.filter((s) => s.chapter === ch);
      box.innerHTML = list.map((s) => buildSkillCard(s)).join("");
    });
  }

  function buildSkillCard(s) {
    const triggersHtml = s.triggers
      .map((t) => `<span class="badge blue">${escapeHtml(t)}</span>`)
      .join("");
    const highlightsHtml = s.highlights
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join("");

    return `
      <article class="skill-card" data-skill-id="${s.id}" data-category="${escapeHtml(s.category)}" data-search="${escapeHtml((s.name + " " + s.id + " " + s.painPoint + " " + s.outcome + " " + s.triggers.join(" ")).toLowerCase())}">
        <div class="skill-top">
          <div class="skill-title-wrap">
            <div class="skill-icon">${s.icon}</div>
            <div>
              <h4 class="skill-title">${escapeHtml(s.name)}</h4>
              <div class="skill-id">資料夾：~/.gemini/config/skills/${escapeHtml(s.id)}/SKILL.md</div>
            </div>
          </div>
          <div class="skill-badges">
            <span class="badge">${escapeHtml(s.category)}</span>
            ${triggersHtml}
          </div>
        </div>
        <p><strong>💡 解決的教學痛點：</strong>${escapeHtml(s.painPoint)}</p>
        <p><strong>✨ 實際產出效果：</strong>${escapeHtml(s.outcome)}</p>
        <ul>${highlightsHtml}</ul>
        <div class="skill-prompt-box">
          <strong>💬 對 Antigravity 這樣說（示範指令）：</strong><br>
          <span>「${escapeHtml(s.promptExample)}」</span>
        </div>
        <div class="skill-actions">
          ${s.downloadUrl ? `<a class="btn btn-primary" href="${escapeHtml(s.downloadUrl)}" download>📦 下載完整技能包 (.zip)</a>` : ""}
          <button class="btn ${s.downloadUrl ? "" : "btn-primary"}" data-copy-prompt="${s.id}">📋 複製示範指令</button>
          <button class="btn btn-accent" data-open-skill="${s.id}">📄 複製 / 下載 SKILL.md 範本</button>
        </div>
      </article>
    `;
  }

  // Quick Skill Directory table in overview
  function renderSkillMatrix() {
    const tbody = document.getElementById("skillMatrixBody");
    if (!tbody) return;
    tbody.innerHTML = skills
      .map(
        (s) => `
      <tr data-category="${escapeHtml(s.category)}">
        <td>${s.icon} <strong>${escapeHtml(s.name)}</strong><br><code class="inline">${escapeHtml(s.id)}</code></td>
        <td>${escapeHtml(s.category)}</td>
        <td>${s.triggers.slice(0, 2).map((t) => `<code class="inline">${escapeHtml(t)}</code>`).join(" ")}</td>
        <td class="matrix-actions-cell">
          ${s.downloadUrl ? `<a class="matrix-dl-link" href="${escapeHtml(s.downloadUrl)}" download>📦 下載 ZIP</a>` : ""}
          <a class="matrix-jump-link" href="#${s.chapter}" data-jump-skill="${s.id}" data-target-page="${s.chapter}">前往章節 →</a>
        </td>
      </tr>`
      )
      .join("");
  }

  // Add data-label attributes to all table cells for stacked Mobile card view
  function decorateTablesForMobile() {
    document.querySelectorAll(".table-wrap table").forEach((table) => {
      const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
        th.textContent.trim()
      );
      if (!headers.length) return;
      table.querySelectorAll("tbody tr").forEach((row) => {
        Array.from(row.children).forEach((cell, idx) => {
          if (headers[idx]) {
            cell.setAttribute("data-label", headers[idx]);
          }
        });
      });
    });
  }

  // Single-chapter pagination
  const mainContent = document.getElementById("mainContent");
  const navLinks = Array.from(document.querySelectorAll(".sidebar .nav-link"));
  const pageViews = Array.from(document.querySelectorAll(".page-view"));
  const chapterPager = document.getElementById("chapterPager");
  const mobileBottomNav = document.getElementById("mobileBottomNav");
  const progressFill = document.getElementById("progressFill");
  const searchInput = document.getElementById("globalSearch");
  const searchBanner = document.getElementById("searchStatusBanner");
  const searchStatusText = document.getElementById("searchStatusText");

  function renderMobileBottomNav(idx) {
    if (!mobileBottomNav) return;
    const prev = idx > 0 ? PAGE_META[idx - 1] : null;
    const next = idx < PAGE_META.length - 1 ? PAGE_META[idx + 1] : null;
    mobileBottomNav.innerHTML = `
      <button class="mbnav-btn" ${prev ? `data-goto-page="${prev.id}"` : "disabled"}>
        <span>← 上一章</span>
      </button>
      <button class="mbnav-btn mbnav-toc" id="mobileTocBtn" type="button">
        <span>📖 目錄 (${idx + 1}/${PAGE_META.length})</span>
      </button>
      <button class="mbnav-btn" ${next ? `data-goto-page="${next.id}"` : "disabled"}>
        <span>下一章 →</span>
      </button>
    `;
  }

  function renderPager(idx) {
    if (!chapterPager) return;
    const prev = idx > 0 ? PAGE_META[idx - 1] : null;
    const next = idx < PAGE_META.length - 1 ? PAGE_META[idx + 1] : null;

    chapterPager.innerHTML = `
      <button class="pager-btn prev ${prev ? "" : "disabled"}" ${prev ? `data-goto-page="${prev.id}"` : ""}>
        <span class="pager-dir">← 上一頁</span>
        <span class="pager-title">${prev ? escapeHtml(prev.label) : ""}</span>
      </button>
      <div class="pager-indicator">第 ${idx + 1} 頁 / 共 ${PAGE_META.length} 頁</div>
      <button class="pager-btn next ${next ? "" : "disabled"}" ${next ? `data-goto-page="${next.id}"` : ""}>
        <span class="pager-dir">下一頁 →</span>
        <span class="pager-title">${next ? escapeHtml(next.label) : ""}</span>
      </button>
    `;
    renderMobileBottomNav(idx);
  }

  function clearSearchMode() {
    if (searchInput && searchInput.value) {
      searchInput.value = "";
    }
    mainContent?.classList.remove("search-mode");
    searchBanner?.classList.remove("visible");
    pageViews.forEach((p) => p.classList.remove("search-match"));
    if (chapterPager) chapterPager.style.display = "";
  }

  function showPage(pageId, opts = {}) {
    const { updateHash = true, scrollTop = true } = opts;
    const idx = PAGE_META.findIndex((m) => m.id === pageId);
    const validIdx = idx >= 0 ? idx : 0;
    const targetId = PAGE_META[validIdx].id;
    currentPageId = targetId;

    clearSearchMode();

    pageViews.forEach((p) => {
      p.classList.toggle("active-page", p.id === targetId);
    });

    navLinks.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === `#${targetId}`);
    });

    renderPager(validIdx);

    if (progressFill) {
      progressFill.style.width = `${((validIdx + 1) / PAGE_META.length) * 100}%`;
    }

    if (updateHash && window.location.hash !== `#${targetId}`) {
      history.pushState(null, "", `#${targetId}`);
    }

    if (scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Modal logic
  const modalBackdrop = document.getElementById("skillModalBackdrop");
  const modalTitle = document.getElementById("skillModalTitle");
  const modalPath = document.getElementById("skillModalPath");
  const modalCode = document.getElementById("skillModalCode");
  const modalCopyBtn = document.getElementById("skillModalCopyBtn");
  const modalDownloadBtn = document.getElementById("skillModalDownloadBtn");
  let activeSkill = null;

  function openSkillModal(skillId) {
    const s = skills.find((item) => item.id === skillId);
    if (!s) return;
    activeSkill = s;
    modalTitle.textContent = `${s.icon} ${s.name} — SKILL.md 可複製範本`;
    modalPath.textContent = `放置路徑：%USERPROFILE%\\.gemini\\config\\skills\\${s.id}\\SKILL.md`;
    modalCode.textContent = s.skillTemplate;
    modalBackdrop.classList.add("open");
  }

  function closeSkillModal() {
    modalBackdrop?.classList.remove("open");
  }

  document.addEventListener("click", (e) => {
    const copyBlockBtn = e.target.closest("[data-copy-code]");
    if (copyBlockBtn) {
      const pre = copyBlockBtn.closest(".code-block")?.querySelector("pre");
      if (pre) copyText(pre.textContent, copyBlockBtn);
      return;
    }

    const promptBtn = e.target.closest("[data-copy-prompt]");
    if (promptBtn) {
      const s = skills.find((item) => item.id === promptBtn.getAttribute("data-copy-prompt"));
      if (s) copyText(s.promptExample, promptBtn);
      return;
    }

    const openBtn = e.target.closest("[data-open-skill]");
    if (openBtn) {
      openSkillModal(openBtn.getAttribute("data-open-skill"));
      return;
    }

    const pagerBtn = e.target.closest("[data-goto-page]");
    if (pagerBtn) {
      showPage(pagerBtn.getAttribute("data-goto-page"));
      return;
    }

    const navLink = e.target.closest(".sidebar .nav-link");
    if (navLink) {
      e.preventDefault();
      const targetId = (navLink.getAttribute("href") || "").replace("#", "");
      showPage(targetId);
      setSidebarOpen(false);
      return;
    }

    if (e.target.closest("#mobileTocBtn")) {
      setSidebarOpen(!sidebar?.classList.contains("open"));
      return;
    }

    const jumpLink = e.target.closest("[data-jump-skill]");
    if (jumpLink) {
      e.preventDefault();
      const id = jumpLink.getAttribute("data-jump-skill");
      const targetPage = jumpLink.getAttribute("data-target-page");
      if (targetPage) {
        showPage(targetPage, { scrollTop: false });
      }
      setTimeout(() => {
        const card = document.querySelector(`[data-skill-id="${id}"]`);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    }
  });

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener("click", () => {
      if (activeSkill) copyText(activeSkill.skillTemplate, modalCopyBtn);
    });
  }

  if (modalDownloadBtn) {
    modalDownloadBtn.addEventListener("click", () => {
      if (!activeSkill) return;
      const blob = new Blob([activeSkill.skillTemplate], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeSkill.id}_SKILL.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  document.getElementById("skillModalClose")?.addEventListener("click", closeSkillModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeSkillModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSkillModal();
  });

  // Category Filter Chips (filters Overview matrix AND skill cards)
  const filterBar = document.getElementById("skillFilterBar");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      filterBar.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-filter");
      document.querySelectorAll("#skillMatrixBody tr, .skill-card").forEach((el) => {
        const match = cat === "all" || el.getAttribute("data-category") === cat;
        el.style.display = match ? "" : "none";
      });
    });
  }

  // Search box (searches across all pages, restores active chapter when cleared)
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        showPage(currentPageId, { updateHash: false, scrollTop: false });
        return;
      }
      mainContent?.classList.add("search-mode");
      if (chapterPager) chapterPager.style.display = "none";
      let matchCount = 0;
      pageViews.forEach((p) => {
        const hit = p.textContent.toLowerCase().includes(q);
        p.classList.toggle("search-match", hit);
        if (hit) matchCount += 1;
      });
      if (searchStatusText) {
        searchStatusText.textContent = `🔍 搜尋「${searchInput.value.trim()}」：共找到 ${matchCount} 個相關章節`;
      }
      searchBanner?.classList.add("visible");
    });
  }

  document.getElementById("clearSearchBtn")?.addEventListener("click", () => {
    showPage(currentPageId, { updateHash: false, scrollTop: true });
  });

  // Theme Toggle
  const themeBtn = document.getElementById("themeToggle");
  function syncThemeBtn(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML =
      theme === "dark"
        ? '<span class="theme-icon">☀️</span><span class="hide-on-mobile"> 亮色模式</span>'
        : '<span class="theme-icon">🌙</span><span class="hide-on-mobile"> 護眼深色</span>';
  }
  const savedTheme = localStorage.getItem("agy_guide_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  syncThemeBtn(savedTheme);
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("agy_guide_theme", next);
      syncThemeBtn(next);
    });
  }

  // Dual Layout Mode (Auto / Mobile / Desktop)
  const layoutBtn = document.getElementById("layoutToggle");
  const sidebarLayoutBtn = document.getElementById("sidebarLayoutToggle");
  let layoutPref = localStorage.getItem("agy_guide_layout") || "auto";

  function applyLayoutMode() {
    const isNarrow = window.innerWidth <= 820;
    const effective =
      layoutPref === "mobile"
        ? "mobile"
        : layoutPref === "desktop"
          ? "desktop"
          : isNarrow
            ? "mobile"
            : "desktop";
    document.documentElement.setAttribute("data-view", effective);
    document.documentElement.setAttribute("data-layout-pref", layoutPref);

    const nextLabel =
      effective === "mobile" ? "🖥️ 切回電腦版" : "📱 預覽手機版";
    if (layoutBtn) layoutBtn.textContent = nextLabel;
    if (sidebarLayoutBtn) {
      sidebarLayoutBtn.textContent =
        effective === "mobile"
          ? "🖥️ 切換為電腦寬版編排"
          : "📱 切換為手機閱讀版編排";
    }
  }

  function toggleLayoutMode() {
    const curView = document.documentElement.getAttribute("data-view");
    layoutPref = curView === "mobile" ? "desktop" : "mobile";
    localStorage.setItem("agy_guide_layout", layoutPref);
    setSidebarOpen(false);
    applyLayoutMode();
  }

  layoutBtn?.addEventListener("click", toggleLayoutMode);
  sidebarLayoutBtn?.addEventListener("click", toggleLayoutMode);
  window.addEventListener("resize", () => {
    if (layoutPref === "auto") applyLayoutMode();
  });

  // Mobile sidebar drawer & backdrop
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  function setSidebarOpen(open) {
    sidebar?.classList.toggle("open", open);
    sidebarBackdrop?.classList.toggle("open", open);
  }
  document.getElementById("menuToggle")?.addEventListener("click", () => {
    setSidebarOpen(!sidebar?.classList.contains("open"));
  });
  sidebarBackdrop?.addEventListener("click", () => setSidebarOpen(false));

  // Handle browser Back/Forward hash changes
  window.addEventListener("hashchange", () => {
    const hashId = (window.location.hash || "#overview").replace("#", "");
    showPage(hashId, { updateHash: false });
  });

  // Initialize
  renderChapterSkills();
  renderSkillMatrix();
  decorateTablesForMobile();
  applyLayoutMode();
  const initialHash = (window.location.hash || "#overview").replace("#", "");
  showPage(initialHash, { updateHash: false, scrollTop: false });
})();
