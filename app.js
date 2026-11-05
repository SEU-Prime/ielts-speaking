const state = {
  topics: [],
  selectedId: null,
  part: "all",
  period: "all",
  region: "Mainland",
  savedOnly: false,
  saved: new Set(JSON.parse(localStorage.getItem("ielts-saved") || "[]")),
  timerSeconds: 0,
  timerHandle: null,
  timerRunning: false,
};

const elements = {
  list: document.querySelector("#topic-list"),
  study: document.querySelector("#study-panel"),
  search: document.querySelector("#search-input"),
  part: document.querySelector("#part-filter"),
  period: document.querySelector("#period-filter"),
  region: document.querySelector("#region-filter"),
  savedFilter: document.querySelector("#saved-filter"),
  savedCount: document.querySelector("#saved-count"),
  resultCount: document.querySelector("#result-count"),
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sourceDescription(topic) {
  const unique = [...new Map(topic.sources.map((source) => [`${source.period}-${source.page}`, source])).values()];
  return unique.map((source) => `${source.period.replace("2026-", "")} 月题库 · p.${source.page}`).join("；");
}

function topicStatus(topic) {
  if (topic.status === "New") return '<span class="tag tag-new">新题</span>';
  if (topic.status === "Retained") return '<span class="tag">保留题</span>';
  return '<span class="tag">历史题</span>';
}

function matchingTopics() {
  const search = elements.search.value.trim().toLowerCase();
  return state.topics.filter((topic) => {
    if (state.part !== "all" && String(topic.part) !== state.part) return false;
    if (state.period === "current" && !topic.latest) return false;
    if (state.period === "archive" && topic.latest) return false;
    if (state.region !== "all" && topic.region !== state.region) return false;
    if (state.savedOnly && !state.saved.has(topic.id)) return false;
    if (search) {
      const haystack = [topic.title, topic.prompt, ...topic.cues, ...topic.questions].join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function renderList() {
  const topics = matchingTopics();
  elements.resultCount.textContent = topics.length;
  elements.savedCount.textContent = state.saved.size;
  elements.savedFilter.setAttribute("aria-pressed", String(state.savedOnly));
  if (!topics.some((topic) => topic.id === state.selectedId)) state.selectedId = topics[0]?.id || null;
  elements.list.innerHTML = topics.map((topic, index) => `
    <button class="topic-button" type="button" data-topic="${escapeHtml(topic.id)}" aria-current="${topic.id === state.selectedId}">
      <span class="topic-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="topic-name">${escapeHtml(topic.title)}</span>
      <span class="topic-meta">${topic.status === "New" ? '<i class="mini-new"></i>' : ""}${topic.questionCount}</span>
    </button>`).join("") || '<div class="empty-state">没有匹配的题目</div>';
  elements.list.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => selectTopic(button.dataset.topic));
  });
  renderTopic();
}

function renderTopic() {
  const topic = state.topics.find((item) => item.id === state.selectedId);
  if (!topic) {
    elements.study.innerHTML = '<div class="empty-state">调整筛选条件以查看题目。</div>';
    return;
  }
  const isSaved = state.saved.has(topic.id);
  const source = sourceDescription(topic);
  const p1List = topic.part === 1 ? `
    <div class="section-heading"><h2>Part 1 questions</h2><span>${topic.questions.length} 道小问</span></div>
    <div class="question-list">${topic.questions.map((question, index) => {
      const answer = topic.answers.part1[index];
      return `
      <article class="question-item">
        <div class="question-head"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><p class="question-text">${escapeHtml(question)}</p></div>
        <details class="question-details" ${index === 0 ? "open" : ""}>
          <summary>参考答案 <span class="answer-timing">约 ${countWords(answer)} 词 · 20–25 秒</span></summary>
          <div class="question-answer"><p>${escapeHtml(answer)}</p></div>
        </details>
      </article>`;
    }).join("")}</div>` : "";
  const p2Block = topic.part === 2 ? `
    <div class="section-heading"><h2>Part 2 cue card</h2><span>目标：1 分 40 秒–2 分钟</span></div>
    <div class="cue-card"><p class="cue-prompt">${escapeHtml(topic.prompt)}</p><ul>${topic.cues.map((cue) => `<li>${escapeHtml(cue)}</li>`).join("")}</ul></div>
    <article class="answer-block">
      <div class="answer-top"><span class="answer-label">口语示范</span><div class="answer-tools"><span class="word-count">${countWords(topic.answers.part2)} 词 · 约 2 分钟</span><button class="text-action" type="button" data-copy="part2-answer">复制</button><button class="text-action" type="button" data-speak="part2-answer">朗读</button></div></div>
      <p class="answer-text" id="part2-answer">${escapeHtml(topic.answers.part2)}</p>
    </article>
    <div class="section-heading"><h2>Part 3 discussion</h2><span>${topic.questions.length} 道延伸题</span></div>
    <div class="question-list">${topic.questions.map((question, index) => {
      const answer = topic.answers.part3[index];
      return `
      <article class="question-item">
        <div class="question-head"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><p class="question-text">${escapeHtml(question)}</p></div>
        <details class="question-details"><summary>参考答案 <span class="answer-timing">约 ${countWords(answer)} 词 · 30–40 秒</span></summary><div class="question-answer"><p>${escapeHtml(answer)}</p></div></details>
      </article>`;
    }).join("")}</div>` : "";
  const part2Prompt = topic.part === 2 ? `<p class="topic-prompt">${escapeHtml(topic.prompt)}</p>` : "";
  const initialTimer = topic.part === 1 ? 30 : 120;
  elements.study.innerHTML = `
    <header class="topic-header">
      <div>
        <div class="topic-kickers"><span class="tag tag-part">Part ${topic.part === 1 ? "1" : "2 & 3"}</span>${topicStatus(topic)}<span class="tag">${topic.region === "Mainland" ? "大陆地区" : "非大陆地区"}</span></div>
        <h2 class="topic-title">${escapeHtml(topic.title)}</h2>${part2Prompt}
      </div>
      <div class="topic-actions">
        <button class="icon-button" id="save-topic" type="button" aria-label="${isSaved ? "取消收藏" : "收藏话题"}" title="${isSaved ? "取消收藏" : "收藏话题"}" aria-pressed="${isSaved}">${isSaved ? "★" : "☆"}</button>
        <button class="icon-button" id="speak-prompt" type="button" aria-label="朗读题目" title="朗读题目">◖</button>
      </div>
    </header>
    ${topic.part === 2 ? p2Block : p1List}
    <section class="practice-area">
      <div class="practice-head"><h2>限时练习</h2><div class="timer-tools"><span class="timer-display" id="timer-display">${formatTime(initialTimer)}</span><button class="small-button primary" id="timer-toggle" type="button">开始</button><button class="small-button" id="timer-reset" type="button">重置</button><span class="word-count">${topic.part === 1 ? "Part 1 · 单题 30 秒" : "Part 2 · 2 分钟"}</span></div></div>
      <textarea class="practice-textarea" id="practice-notes" placeholder="记录自己的表达思路…" aria-label="练习笔记">${escapeHtml(localStorage.getItem(`ielts-note-${topic.id}`) || "")}</textarea>
    </section>
    <p class="source-line"><strong>题库来源</strong>　${escapeHtml(source)}</p>`;
  bindTopicActions(topic, initialTimer);
}

function selectTopic(id) {
  state.selectedId = id;
  renderList();
}

function bindTopicActions(topic, initialTimer) {
  document.querySelector("#save-topic").addEventListener("click", () => {
    if (state.saved.has(topic.id)) state.saved.delete(topic.id);
    else state.saved.add(topic.id);
    localStorage.setItem("ielts-saved", JSON.stringify([...state.saved]));
    renderList();
  });
  document.querySelector("#speak-prompt").addEventListener("click", () => speak(topic.part === 1 ? topic.questions.join(". ") : topic.prompt));
  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
    const text = document.querySelector(`#${button.dataset.copy}`)?.textContent || "";
    try { await navigator.clipboard.writeText(text); button.textContent = "已复制"; setTimeout(() => { button.textContent = "复制"; }, 1200); }
    catch { button.textContent = "复制失败"; setTimeout(() => { button.textContent = "复制"; }, 1200); }
  }));
  document.querySelectorAll("[data-speak]").forEach((button) => button.addEventListener("click", () => speak(document.querySelector(`#${button.dataset.speak}`)?.textContent || "")));
  const notes = document.querySelector("#practice-notes");
  notes.addEventListener("input", () => localStorage.setItem(`ielts-note-${topic.id}`, notes.value));
  state.timerSeconds = initialTimer;
  state.timerRunning = false;
  clearInterval(state.timerHandle);
  const display = document.querySelector("#timer-display");
  const toggle = document.querySelector("#timer-toggle");
  toggle.addEventListener("click", () => {
    if (state.timerRunning) {
      clearInterval(state.timerHandle);
      state.timerRunning = false;
      toggle.textContent = "继续";
      return;
    }
    if (state.timerSeconds <= 0) state.timerSeconds = initialTimer;
    state.timerRunning = true;
    toggle.textContent = "暂停";
    state.timerHandle = setInterval(() => {
      state.timerSeconds -= 1;
      display.textContent = formatTime(state.timerSeconds);
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerHandle);
        state.timerRunning = false;
        toggle.textContent = "再练一次";
      }
    }, 1000);
  });
  document.querySelector("#timer-reset").addEventListener("click", () => {
    clearInterval(state.timerHandle);
    state.timerRunning = false;
    state.timerSeconds = initialTimer;
    display.textContent = formatTime(initialTimer);
    toggle.textContent = "开始";
  });
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function updateMetrics() {
  const mainland = state.topics.filter((topic) => topic.region === "Mainland");
  document.querySelector("#metric-topics").textContent = mainland.length;
  document.querySelector("#metric-p1").textContent = mainland.filter((topic) => topic.part === 1).reduce((sum, topic) => sum + topic.questions.length, 0);
  document.querySelector("#metric-p3").textContent = mainland.filter((topic) => topic.part === 2).reduce((sum, topic) => sum + topic.questions.length, 0);
}

elements.search.addEventListener("input", renderList);
elements.part.addEventListener("change", () => { state.part = elements.part.value; renderList(); });
elements.period.addEventListener("change", () => { state.period = elements.period.value; renderList(); });
elements.region.addEventListener("change", () => { state.region = elements.region.value; renderList(); });
elements.savedFilter.addEventListener("click", () => { state.savedOnly = !state.savedOnly; renderList(); });
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.search.focus();
  }
});

fetch("data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Unable to load the question bank");
    return response.json();
  })
  .then((topics) => {
    state.topics = topics;
    state.selectedId = topics.find((topic) => topic.region === "Mainland" && topic.latest)?.id || topics[0]?.id || null;
    updateMetrics();
    renderList();
  })
  .catch(() => {
    elements.study.innerHTML = '<div class="empty-state">题库载入失败，请通过本地服务器打开此页面。</div>';
  });
