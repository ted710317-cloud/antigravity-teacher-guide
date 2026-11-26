(function () {
  const skills = window.TEACHER_SKILLS || [];

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
          <button class="btn btn-primary" data-copy-prompt="${s.id}">📋 複製示範指令</button>
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
      <tr>
        <td>${s.icon} <strong>${escapeHtml(s.name)}</strong><br><code class="inline">${escapeHtml(s.id)}</code></td>
        <td>${escapeHtml(s.category)}</td>
        <td>${s.triggers.slice(0, 2).map((t) => `<code class="inline">${escapeHtml(t)}</code>`).join(" ")}</td>
        <td><a href="#${s.chapter}" data-jump-skill="${s.id}">前往章節 →</a></td>
      </tr>`
      )
      .join("");
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
    modalBackdrop.classList.remove("open");
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

    const jumpLink = e.target.closest("[data-jump-skill]");
    if (jumpLink) {
      const id = jumpLink.getAttribute("data-jump-skill");
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

  // Category Filter Chips (filters skill cards + auto-hides empty chapters only when filtering)
  const filterBar = document.getElementById("skillFilterBar");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      filterBar.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-filter");
      document.querySelectorAll(".skill-card").forEach((card) => {
        const match = cat === "all" || card.getAttribute("data-category") === cat;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // Search box
  const searchInput = document.getElementById("globalSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll(".chapter").forEach((ch) => {
        if (!q) {
          ch.style.display = "";
          ch.querySelectorAll(".skill-card").forEach((c) => (c.style.display = ""));
          return;
        }
        const text = ch.textContent.toLowerCase();
        ch.style.display = text.includes(q) ? "" : "none";
      });
    });
  }

  // Theme Toggle
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("agy_guide_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (themeBtn) {
    themeBtn.textContent = savedTheme === "dark" ? "☀️ 亮色模式" : "🌙 護眼深色";
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("agy_guide_theme", next);
      themeBtn.textContent = next === "dark" ? "☀️ 亮色模式" : "🌙 護眼深色";
    });
  }

  // Mobile sidebar toggle
  const sidebar = document.getElementById("sidebar");
  document.getElementById("menuToggle")?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
  });
  sidebar?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => sidebar.classList.remove("open"));
  });

  // Scroll progress & active nav highlight
  const progressFill = document.getElementById("progressFill");
  const navLinks = Array.from(document.querySelectorAll(".sidebar .nav-link"));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      if (progressFill) progressFill.style.width = `${pct}%`;

      let currentId = sections[0]?.id;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= 140) {
          currentId = sec.id;
        }
      }
      navLinks.forEach((l) => {
        l.classList.toggle("active", l.getAttribute("href") === `#${currentId}`);
      });
    },
    { passive: true }
  );

  renderChapterSkills();
  renderSkillMatrix();
})();
