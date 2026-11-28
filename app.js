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

  const BASE_TITLE = "Google Antigravity 教師實戰推廣手冊｜新進國小 朕 老師";
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let currentPageId = "overview";

  // Live region announcer and per-button copy feedback timers
  const liveAnnouncer = document.getElementById("liveAnnouncer");
  const modalCopyStatus = document.getElementById("skillModalCopyStatus");
  const copyTimers = new WeakMap();
  let lastAnnouncement = "";

  function announceStatus(message, statusEl) {
    let text = message;
    if (text === lastAnnouncement) text += "\u00A0";
    lastAnnouncement = text;
    const target = statusEl || liveAnnouncer;
    if (!target) return;
    target.textContent = "";
    requestAnimationFrame(() => {
      target.textContent = text;
    });
  }

  function svgIcon(id) {
    return `<svg class="ico" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function legacyCopy(text) {
    const previousFocus = document.activeElement;
    const field = Object.assign(document.createElement("textarea"), { value: text });
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;inset-block-start:0;opacity:0";
    document.body.append(field);
    field.select();
    try {
      return document.execCommand("copy");
    } catch (_) {
      return false;
    } finally {
      field.remove();
      previousFocus?.focus?.({ preventScroll: true });
    }
  }

  async function copyText(text, btn, statusEl) {
    const value = (text || "").trim();
    if (!value) return;
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch (_) {}
    if (!ok) {
      ok = legacyCopy(value);
    }

    if (btn) {
      const prevTimer = copyTimers.get(btn);
      if (prevTimer) clearTimeout(prevTimer);
      if (!btn.dataset.originalHtml) {
        btn.dataset.originalHtml = btn.innerHTML;
      }
      if (ok) {
        btn.textContent = "✓ 已複製！";
        btn.classList.add("copied");
        announceStatus("已複製到剪貼簿", statusEl);
      } else {
        announceStatus("複製失敗，請手動選取複製", statusEl);
      }
      copyTimers.set(
        btn,
        setTimeout(() => {
          if (btn.dataset.originalHtml) {
            btn.innerHTML = btn.dataset.originalHtml;
          }
          btn.classList.remove("copied");
          if (statusEl) statusEl.textContent = "";
        }, 1800)
      );
    } else {
      announceStatus(ok ? "已複製到剪貼簿" : "複製失敗", statusEl);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightText(text, query) {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const pattern = new RegExp(`(${escapeRegex(escapeHtml(query))})`, "gi");
    return safe.replace(pattern, "<mark>$1</mark>");
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
      <article class="skill-card" data-skill-id="${escapeHtml(s.id)}" data-category="${escapeHtml(s.category)}">
        <div class="skill-top">
          <div class="skill-title-wrap">
            <div class="skill-icon" aria-hidden="true">${s.icon}</div>
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
        <p><strong><span aria-hidden="true">💡</span> 解決的教學痛點：</strong>${escapeHtml(s.painPoint)}</p>
        <p><strong><span aria-hidden="true">✨</span> 實際產出效果：</strong>${escapeHtml(s.outcome)}</p>
        <ul>${highlightsHtml}</ul>
        <div class="skill-prompt-box">
          <strong><span aria-hidden="true">💬</span> 對 Antigravity 這樣說（示範指令）：</strong><br>
          <span>「${escapeHtml(s.promptExample)}」</span>
        </div>
        <div class="skill-actions">
          ${s.downloadUrl ? `<a class="btn btn-primary" href="${escapeHtml(s.downloadUrl)}" download>${svgIcon("ico-package")}<span>下載完整技能包 (.zip)</span></a>` : ""}
          <button type="button" class="btn ${s.downloadUrl ? "" : "btn-primary"}" data-copy-prompt="${escapeHtml(s.id)}">${svgIcon("ico-copy")}<span>複製示範指令</span></button>
          <button type="button" class="btn btn-accent" data-open-skill="${escapeHtml(s.id)}">${svgIcon("ico-file")}<span>複製 / 下載 SKILL.md 範本</span></button>
        </div>
      </article>
    `;
  }

  // Quick Skill Directory table in overview (plain-language benefit instead of folder ID)
  function renderSkillMatrix() {
    const tbody = document.getElementById("skillMatrixBody");
    if (!tbody) return;
    tbody.innerHTML = skills
      .map(
        (s) => `
      <tr data-category="${escapeHtml(s.category)}">
        <th scope="row">
          <span aria-hidden="true">${s.icon}</span> <strong>${escapeHtml(s.name)}</strong>
          <div class="matrix-summary">${escapeHtml(s.summary || s.outcome)}</div>
        </th>
        <td class="matrix-cat-cell">${escapeHtml(s.category)}</td>
        <td class="matrix-triggers-cell">${s.triggers.slice(0, 2).map((t) => `<code class="inline">${escapeHtml(t)}</code>`).join(" ")}</td>
        <td class="matrix-actions-cell">
          ${s.downloadUrl ? `<a class="matrix-dl-link" href="${escapeHtml(s.downloadUrl)}" download>${svgIcon("ico-package")}<span>下載 ZIP</span></a>` : ""}
          <a class="matrix-jump-link" href="#${escapeHtml(s.chapter)}" data-jump-skill="${escapeHtml(s.id)}" data-target-page="${escapeHtml(s.chapter)}">前往章節 →</a>
        </td>
      </tr>`
      )
      .join("");
  }

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

  // Single-chapter pagination & search containers
  const topbar = document.getElementById("topbar");
  const mainContent = document.getElementById("mainContent");
  const navLinks = Array.from(document.querySelectorAll(".sidebar .nav-link"));
  const pageViews = Array.from(document.querySelectorAll(".page-view"));
  const chapterPager = document.getElementById("chapterPager");
  const mobileBottomNav = document.getElementById("mobileBottomNav");
  const progressFill = document.getElementById("progressFill");
  const searchInput = document.getElementById("globalSearch");
  const searchExpandBtn = document.getElementById("searchExpandBtn");
  const searchCollapseBtn = document.getElementById("searchCollapseBtn");
  const searchBanner = document.getElementById("searchStatusBanner");
  const searchStatusText = document.getElementById("searchStatusText");
  const searchResultsView = document.getElementById("searchResultsView");

  // Pre-index page sections for fast, non-destructive search results
  const chapterIndex = PAGE_META.map((meta) => {
    const el = document.getElementById(meta.id);
    if (!el) return null;
    const blocks = Array.from(
      el.querySelectorAll("h2, h3, h4, p, li, .callout, .math-game-card, .classroom-card, td")
    )
      .map((node) => ({
        node,
        text: (node.textContent || "").replace(/\s+/g, " ").trim()
      }))
      .filter((b) => b.text.length > 0);
    return {
      id: meta.id,
      label: meta.label,
      fullText: blocks.map((b) => b.text).join(" "),
      blocks
    };
  }).filter(Boolean);

  function setMobileSearchOpen(open) {
    if (!topbar) return;
    const shouldOpen = Boolean(open);
    topbar.classList.toggle("search-open", shouldOpen);
    searchExpandBtn?.setAttribute("aria-expanded", String(shouldOpen));
    if (shouldOpen) {
      searchInput?.focus();
    }
  }

  function renderMobileBottomNav(idx) {
    if (!mobileBottomNav) return;
    const prev = idx > 0 ? PAGE_META[idx - 1] : null;
    const next = idx < PAGE_META.length - 1 ? PAGE_META[idx + 1] : null;
    const isSidebarOpen = sidebar?.classList.contains("open") ? "true" : "false";
    mobileBottomNav.innerHTML = `
      <button type="button" class="mbnav-btn" ${prev ? `data-goto-page="${prev.id}"` : "disabled"}>
        ${svgIcon("ico-chevron-left")}<span>上一章</span>
      </button>
      <button type="button" class="mbnav-btn mbnav-toc" id="mobileTocBtn" aria-expanded="${isSidebarOpen}" aria-controls="sidebar">
        ${svgIcon("ico-book")}<span>目錄 (${idx + 1}/${PAGE_META.length})</span>
      </button>
      <button type="button" class="mbnav-btn" ${next ? `data-goto-page="${next.id}"` : "disabled"}>
        <span>下一章</span>${svgIcon("ico-chevron-right")}
      </button>
    `;
  }

  function renderPager(idx) {
    if (!chapterPager) return;
    const prev = idx > 0 ? PAGE_META[idx - 1] : null;
    const next = idx < PAGE_META.length - 1 ? PAGE_META[idx + 1] : null;

    chapterPager.innerHTML = `
      <button type="button" class="pager-btn prev ${prev ? "" : "disabled"}" ${prev ? `data-goto-page="${prev.id}"` : "disabled"}>
        <span class="pager-dir">${svgIcon("ico-chevron-left")}<span>上一頁</span></span>
        <span class="pager-title">${prev ? escapeHtml(prev.label) : ""}</span>
      </button>
      <div class="pager-indicator">第 ${idx + 1} 頁 / 共 ${PAGE_META.length} 頁</div>
      <button type="button" class="pager-btn next ${next ? "" : "disabled"}" ${next ? `data-goto-page="${next.id}"` : "disabled"}>
        <span class="pager-dir"><span>下一頁</span>${svgIcon("ico-chevron-right")}</span>
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
    if (searchResultsView) searchResultsView.innerHTML = "";
    if (chapterPager) chapterPager.style.display = "";
  }

  function showPage(pageId, opts = {}) {
    const { updateHash = true, scrollTop = true } = opts;
    const idx = PAGE_META.findIndex((m) => m.id === pageId);
    const validIdx = idx >= 0 ? idx : 0;
    const targetMeta = PAGE_META[validIdx];
    const targetId = targetMeta.id;
    currentPageId = targetId;

    clearSearchMode();
    setMobileSearchOpen(false);

    pageViews.forEach((p) => {
      p.classList.toggle("active-page", p.id === targetId);
    });

    navLinks.forEach((l) => {
      const isCurrent = l.getAttribute("href") === `#${targetId}`;
      l.classList.toggle("active", isCurrent);
      if (isCurrent) {
        l.setAttribute("aria-current", "page");
      } else {
        l.removeAttribute("aria-current");
      }
    });

    document.title = targetId === "overview" ? BASE_TITLE : `${targetMeta.label}｜${BASE_TITLE}`;

    renderPager(validIdx);

    if (progressFill) {
      progressFill.style.width = `${((validIdx + 1) / PAGE_META.length) * 100}%`;
    }

    if (updateHash && window.location.hash !== `#${targetId}`) {
      history.pushState(null, "", `#${targetId}`);
    }

    if (scrollTop) {
      window.scrollTo({
        top: 0,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    }
  }

  // Build search snippet centered around first match
  function buildSnippet(text, q) {
    const lower = text.toLowerCase();
    const pos = lower.indexOf(q);
    if (pos < 0) return text.slice(0, 120);
    const start = Math.max(0, pos - 38);
    const end = Math.min(text.length, pos + q.length + 78);
    const prefix = start > 0 ? "…" : "";
    const suffix = end < text.length ? "…" : "";
    return prefix + text.slice(start, end) + suffix;
  }

  function renderSearchResults(rawQuery) {
    if (!searchResultsView) return;
    const q = rawQuery.trim().toLowerCase();
    const matchedSkills = skills.filter((s) => {
      const haystack = [
        s.name,
        s.summary || "",
        s.id,
        s.category,
        s.painPoint,
        s.outcome,
        s.triggers.join(" "),
        s.promptExample
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    const matchedChapters = [];
    chapterIndex.forEach((ch) => {
      const hitBlock = ch.blocks.find((b) => b.text.toLowerCase().includes(q));
      if (hitBlock) {
        matchedChapters.push({
          id: ch.id,
          label: ch.label,
          snippet: buildSnippet(hitBlock.text, q)
        });
      }
    });

    if (searchStatusText) {
      searchStatusText.innerHTML = `${svgIcon("ico-search")}<span>搜尋「${escapeHtml(rawQuery.trim())}」：找到 ${matchedSkills.length} 支技能、${matchedChapters.length} 個相關章節</span>`;
    }

    if (matchedSkills.length === 0 && matchedChapters.length === 0) {
      searchResultsView.innerHTML = `
        <div class="search-empty">
          <p>找不到符合「<strong>${escapeHtml(rawQuery.trim())}</strong>」的技能或章節內容。</p>
          <p>試試看搜尋：<strong>作文、Padlet、Word、輔導、數學、MCP、Turbo</strong>。</p>
        </div>
      `;
      return;
    }

    const skillsSection = matchedSkills.length
      ? `
      <div class="search-group">
        <h3 class="search-group-title">符合的教學技能（${matchedSkills.length} 支）</h3>
        <div class="search-result-list">
          ${matchedSkills
            .map((s) => {
              const chMeta = PAGE_META.find((m) => m.id === s.chapter);
              return `
              <article class="search-result-card">
                <div class="search-result-head">
                  <h4 class="search-result-title"><span aria-hidden="true">${s.icon}</span> ${highlightText(s.name, rawQuery.trim())}</h4>
                  <span class="badge">${escapeHtml(s.category)}</span>
                </div>
                <p class="search-result-snippet">${highlightText(s.summary || s.outcome, rawQuery.trim())}</p>
                <div class="search-result-actions">
                  <button type="button" class="btn btn-primary" data-jump-skill="${escapeHtml(s.id)}" data-target-page="${escapeHtml(s.chapter)}">
                    前往「${escapeHtml(chMeta ? chMeta.label.split("｜")[0] : s.chapter)}」查看 →
                  </button>
                  <button type="button" class="btn" data-open-skill="${escapeHtml(s.id)}">
                    ${svgIcon("ico-file")}<span>檢視 / 複製 SKILL.md</span>
                  </button>
                </div>
              </article>`;
            })
            .join("")}
        </div>
      </div>`
      : "";

    const chaptersSection = matchedChapters.length
      ? `
      <div class="search-group">
        <h3 class="search-group-title">相關手冊章節（${matchedChapters.length} 頁）</h3>
        <div class="search-result-list">
          ${matchedChapters
            .map(
              (ch) => `
            <article class="search-result-card">
              <div class="search-result-head">
                <h4 class="search-result-title">${highlightText(ch.label, rawQuery.trim())}</h4>
              </div>
              <p class="search-result-snippet">${highlightText(ch.snippet, rawQuery.trim())}</p>
              <div class="search-result-actions">
                <button type="button" class="btn" data-search-goto="${escapeHtml(ch.id)}" data-search-query="${escapeHtml(rawQuery.trim())}">
                  跳轉閱讀此章節 →
                </button>
              </div>
            </article>`
            )
            .join("")}
        </div>
      </div>`
      : "";

    searchResultsView.innerHTML = skillsSection + chaptersSection;
  }

  // Native <dialog> Modal logic with top-layer exit transition fallback
  const skillModal = document.getElementById("skillModal");
  const modalTitle = document.getElementById("skillModalTitle");
  const modalPath = document.getElementById("skillModalPath");
  const modalCode = document.getElementById("skillModalCode");
  const modalCopyBtn = document.getElementById("skillModalCopyBtn");
  const modalDownloadBtn = document.getElementById("skillModalDownloadBtn");
  let activeSkill = null;
  let supportsDisplayTransition;

  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
      return false;
    }
    const probe = document.createElement("div");
    probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = "none";
    supportsDisplayTransition = getComputedStyle(probe).display === "block";
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return Boolean(window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay());
  }

  async function closeTopLayer(dialog) {
    if (!dialog?.open) return;
    if (!supportsTopLayerExit()) {
      dialog.setAttribute("data-closing", "");
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 600))
        ]);
      }
      if (!dialog.hasAttribute("data-closing")) return;
      dialog.removeAttribute("data-closing");
    }
    dialog.close();
  }

  function openSkillModal(skillId) {
    const s = skills.find((item) => item.id === skillId);
    if (!s || !skillModal) return;
    activeSkill = s;
    modalTitle.textContent = `${s.icon} ${s.name} — SKILL.md 可複製範本`;
    modalPath.textContent = `放置路徑：%USERPROFILE%\\.gemini\\config\\skills\\${s.id}\\SKILL.md`;
    modalCode.textContent = s.skillTemplate;
    if (modalCopyStatus) modalCopyStatus.textContent = "";
    skillModal.removeAttribute("data-closing");
    if (!skillModal.open) {
      skillModal.showModal();
    }
  }

  if (skillModal) {
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const outside = (e) => {
        const r = skillModal.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      skillModal.addEventListener("pointerdown", (e) => {
        pressedOutside = outside(e);
      });
      skillModal.addEventListener("pointerup", (e) => {
        if (pressedOutside && outside(e)) closeTopLayer(skillModal);
      });
    }

    skillModal.addEventListener("cancel", (e) => {
      if (!supportsTopLayerExit()) {
        e.preventDefault();
        closeTopLayer(skillModal);
      }
    });
  }

  document.getElementById("skillModalClose")?.addEventListener("click", () => {
    closeTopLayer(skillModal);
  });

  // Skip link focus management
  document.querySelector(".skip-link")?.addEventListener("click", (e) => {
    const heading = document.querySelector(".page-view.active-page h2");
    if (!heading) return;
    e.preventDefault();
    if (!heading.hasAttribute("tabindex")) {
      heading.setAttribute("tabindex", "-1");
      heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
    }
    heading.focus({ preventScroll: false });
  });

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
    if (pagerBtn && !pagerBtn.disabled) {
      showPage(pagerBtn.getAttribute("data-goto-page"));
      return;
    }

    const searchGotoBtn = e.target.closest("[data-search-goto]");
    if (searchGotoBtn) {
      const pageId = searchGotoBtn.getAttribute("data-search-goto");
      const q = (searchGotoBtn.getAttribute("data-search-query") || "").toLowerCase();
      showPage(pageId, { scrollTop: false });
      const ch = chapterIndex.find((item) => item.id === pageId);
      const hitBlock = q && ch ? ch.blocks.find((b) => b.text.toLowerCase().includes(q)) : null;
      setTimeout(() => {
        if (hitBlock?.node) {
          hitBlock.node.scrollIntoView({
            behavior: reducedMotionQuery.matches ? "auto" : "smooth",
            block: "center"
          });
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
        }
      }, 60);
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

    const mobileTocBtn = e.target.closest("#mobileTocBtn");
    if (mobileTocBtn) {
      setSidebarOpen(!sidebar?.classList.contains("open"), mobileTocBtn);
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
        if (card) {
          card.scrollIntoView({
            behavior: reducedMotionQuery.matches ? "auto" : "smooth",
            block: "center"
          });
        }
      }, 60);
    }
  });

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener("click", () => {
      if (activeSkill) copyText(activeSkill.skillTemplate, modalCopyBtn, modalCopyStatus);
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

  // Category Filter Chips (strictly scoped to overview matrix)
  const filterBar = document.getElementById("skillFilterBar");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      filterBar.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      const cat = chip.getAttribute("data-filter");
      document.querySelectorAll("#skillMatrixBody tr").forEach((el) => {
        const match = cat === "all" || el.getAttribute("data-category") === cat;
        el.style.display = match ? "" : "none";
      });
    });
  }

  // Search box (independent results view; restores active chapter when cleared)
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const raw = searchInput.value;
      if (!raw.trim()) {
        showPage(currentPageId, { updateHash: false, scrollTop: false });
        return;
      }
      mainContent?.classList.add("search-mode");
      if (chapterPager) chapterPager.style.display = "none";
      renderSearchResults(raw);
      searchBanner?.classList.add("visible");
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  searchExpandBtn?.addEventListener("click", () => {
    setMobileSearchOpen(true);
  });

  searchCollapseBtn?.addEventListener("click", () => {
    if (searchInput?.value.trim()) {
      showPage(currentPageId, { updateHash: false, scrollTop: false });
    } else {
      setMobileSearchOpen(false);
    }
  });

  document.getElementById("clearSearchBtn")?.addEventListener("click", () => {
    showPage(currentPageId, { updateHash: false, scrollTop: true });
    searchInput?.focus();
  });

  // Theme Toggle synced with <meta name="color-scheme"> and system preference
  const themeBtn = document.getElementById("themeToggle");
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
  const THEME_STORAGE_KEY = "agy_guide_theme";

  function getSystemScheme() {
    return darkSchemeQuery.matches ? "dark" : "light";
  }

  function getStoredScheme() {
    try {
      const val = localStorage.getItem(THEME_STORAGE_KEY);
      return val === "light" || val === "dark" ? val : null;
    } catch (_) {
      return null;
    }
  }

  function getRenderedScheme() {
    return getStoredScheme() || getSystemScheme();
  }

  function syncThemeBtn(renderedScheme) {
    if (!themeBtn) return;
    const isDark = renderedScheme === "dark";
    themeBtn.innerHTML = isDark
      ? `${svgIcon("ico-sun")}<span class="hide-on-mobile">亮色模式</span>`
      : `${svgIcon("ico-moon")}<span class="hide-on-mobile">護眼深色</span>`;
    themeBtn.setAttribute("aria-label", isDark ? "切換為亮色模式" : "切換為護眼深色模式");
    themeBtn.setAttribute("aria-pressed", String(isDark));
  }

  function applyColorScheme() {
    const stored = getStoredScheme();
    if (stored) {
      if (colorSchemeMeta) colorSchemeMeta.content = stored;
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      if (colorSchemeMeta) colorSchemeMeta.content = "light dark";
      document.documentElement.removeAttribute("data-theme");
    }
    syncThemeBtn(getRenderedScheme());
  }

  applyColorScheme();

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const target = getRenderedScheme() === "dark" ? "light" : "dark";
      try {
        if (target === getSystemScheme()) {
          localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
          localStorage.setItem(THEME_STORAGE_KEY, target);
        }
      } catch (_) {}
      applyColorScheme();
    });
  }

  darkSchemeQuery.addEventListener("change", applyColorScheme);
  window.addEventListener("storage", (e) => {
    if (e.key === THEME_STORAGE_KEY) applyColorScheme();
  });

  // Dual Layout Mode (Auto / Mobile / Desktop) — managed via sidebar settings
  const sidebarLayoutBtn = document.getElementById("sidebarLayoutToggle");
  let layoutPref = "auto";
  try {
    layoutPref = localStorage.getItem("agy_guide_layout") || "auto";
  } catch (_) {}

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

    if (sidebarLayoutBtn) {
      sidebarLayoutBtn.innerHTML =
        effective === "mobile"
          ? `${svgIcon("ico-monitor")}<span>切換為電腦寬版編排</span>`
          : `${svgIcon("ico-smartphone")}<span>切換為手機閱讀版編排</span>`;
    }

    if (effective !== "mobile") {
      setMobileSearchOpen(false);
      if (sidebar?.classList.contains("open")) {
        setSidebarOpen(false);
      }
    }
  }

  function toggleLayoutMode() {
    const curView = document.documentElement.getAttribute("data-view");
    layoutPref = curView === "mobile" ? "desktop" : "mobile";
    try {
      localStorage.setItem("agy_guide_layout", layoutPref);
    } catch (_) {}
    setSidebarOpen(false);
    applyLayoutMode();
  }

  sidebarLayoutBtn?.addEventListener("click", toggleLayoutMode);
  window.addEventListener("resize", () => {
    if (layoutPref === "auto") applyLayoutMode();
  });

  // Mobile sidebar drawer, backdrop & inert modality
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const menuToggleBtn = document.getElementById("menuToggle");
  let lastSidebarInvoker = null;

  function setSidebarOpen(open, invokerEl) {
    const isMobileView = document.documentElement.getAttribute("data-view") === "mobile";
    const shouldOpen = Boolean(open && isMobileView);
    sidebar?.classList.toggle("open", shouldOpen);
    sidebarBackdrop?.classList.toggle("open", shouldOpen);

    if (menuToggleBtn) {
      menuToggleBtn.setAttribute("aria-expanded", String(shouldOpen));
    }
    const mobileTocBtn = document.getElementById("mobileTocBtn");
    if (mobileTocBtn) {
      mobileTocBtn.setAttribute("aria-expanded", String(shouldOpen));
    }

    if (mainContent) mainContent.inert = shouldOpen;
    if (mobileBottomNav) mobileBottomNav.inert = shouldOpen;

    if (shouldOpen) {
      lastSidebarInvoker = invokerEl || document.activeElement;
      const focusTarget =
        sidebar?.querySelector(".nav-link.active") || sidebar?.querySelector(".nav-link");
      focusTarget?.focus({ preventScroll: true });
    } else if (lastSidebarInvoker && typeof lastSidebarInvoker.focus === "function") {
      const targetToFocus = lastSidebarInvoker;
      lastSidebarInvoker = null;
      if (isMobileView) {
        targetToFocus.focus({ preventScroll: true });
      }
    }
  }

  menuToggleBtn?.addEventListener("click", () => {
    setSidebarOpen(!sidebar?.classList.contains("open"), menuToggleBtn);
  });
  sidebarBackdrop?.addEventListener("click", () => setSidebarOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (sidebar?.classList.contains("open")) {
        setSidebarOpen(false);
      } else if (topbar?.classList.contains("search-open")) {
        setMobileSearchOpen(false);
      }
    }
  });

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
