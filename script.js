const audioBtn = document.getElementById("toggle-audio");
const audioIcon = document.getElementById("audio-icon");
const music = document.getElementById("background-music");
let isPlaying = false;

music.volume = 0.5;

audioBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    audioIcon.classList.remove("fa-volume-high");
    audioIcon.classList.add("fa-volume-xmark");
  } else {
    music.play().catch((error) => {
      console.log("Người dùng cần tương tác với trang trước khi phát nhạc.");
    });
    audioIcon.classList.remove("fa-volume-xmark");
    audioIcon.classList.add("fa-volume-high");
  }
  isPlaying = !isPlaying;
});

document.body.addEventListener(
  "click",
  () => {
    if (!isPlaying) {
      music
        .play()
        .then(() => {
          isPlaying = true;
          audioIcon.classList.remove("fa-volume-xmark");
          audioIcon.classList.add("fa-volume-high");
        })
        .catch((e) => {});
    }
  },
  { once: true }
);
