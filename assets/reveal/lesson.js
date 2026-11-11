const params = new URLSearchParams(
  window.location.search
);

const lesson = params.get("lesson");
const container = document.getElementById(
  "slide-container"
);

// 授業番号：2～3桁の数字のみ
if (lesson && /^\d{2,3}$/.test(lesson)) {

  const section = document.createElement("section");

  section.setAttribute(
    "data-markdown",
    `lesson/${lesson}.md`
  );

  container.appendChild(section);

} else {

  const section = document.createElement("section");
  const heading = document.createElement("h2");
  heading.textContent = "授業が指定されていません";

  section.appendChild(heading);
  container.appendChild(section);
}

Reveal.initialize({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  center: false,
  width: 1280,
  height: 720,
  transition: "none",
  plugins: [RevealMarkdown]
});
