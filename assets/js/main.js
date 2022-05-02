/**
 * 1. Render song -> ok
 * 2. Scroll song -> ok
 * 3. Play/ pause/ seek -> ok
 * 4. CD rotate -> ok
 * 5. Next/ Prev -> ok
 * 6. Random -> ok
 * 7. Next/ Repeat when ended -> ok
 * 8. Active song -> ok
 * 9. Scroll active song into view  -> ok
 * 10. Play song when click -> ok
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".dashboard__cd");
const songName = $("#song-name");
const cdThumb = $(".dashboard__cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player-container");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "They said",
      singer: "Binz",
      path: "./assets/music/Song01_TheySaid-TouliverBinz.mp3",
      image: "./assets/images/img01_TheySaid.jpg",
    },
    {
      name: "Sao Cũng Được",
      singer: "Binz",
      path: "./assets/music/Song02_SaoCungDuocGuitarVersion-Binz.mp3",
      image: "./assets/images/img02_SaoCungDuoc.jpg",
    },
    {
      name: "Lạc trôi",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/Song03_Lac-Troi-Triple-D-Remix-Son-Tung-M-TP.mp3",
      image: "./assets/images/img03_Lac_troi.jpg",
    },
    {
      name: "See you again",
      singer: "Wiz Khalifa ft. Charlie Puth",
      path: "./assets/music/Song04_SeeYouAgain.mp3",
      image: "./assets/images/img04_SeeYouAgain.jpg",
    },
    {
      name: "Unstoppable",
      singer: "Sia",
      path: "./assets/music/Song05_Unstoppable.mp3",
      image: "./assets/images/img05_Unstoppable.jpg",
    },
    {
      name: "Reality",
      singer: "Lost Frequencies",
      path: "./assets/music/Song06_Reality.mp3",
      image: "./assets/images/img06_Reality.jpg",
    },
    {
      name: "Until You",
      singer: "Shayne Ward",
      path: "./assets/music/Song07_UntilYou.mp3",
      image: "./assets/images/img07_UntilYou.jpg",
    },
    {
      name: "What make you beautiful",
      singer: "One Direction",
      path: "./assets/music/Song08_WhatMakeYouBeautiful.mp3",
      image: "./assets/images/img08_What_Makes_You_Beautiful.jpg",
    },
    {
      name: "Uptown Funk",
      singer: "Mark Ronson ft. Bruno Mars",
      path: "./assets/music/Song09_UptownFunk.mp3",
      image: "./assets/images/img09_Uptownfund.jpg",
    },
    {
      name: "Despacito",
      singer: "Luis Fonsi ft. Daddy Yankee",
      path: "./assets/music/Song10_Despacito.mp3",
      image: "./assets/images/img10_Despacito.jpg",
    },
  ],
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // handle CD rotate / stop rotate
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xu ly phong to thu nho CD
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // handle onclick PLAY / PAUSE
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // When song playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // When dong pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // when scroll time song
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // when seek song
    progress.onchange = function (event) {
      const seekTime = (event.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // when next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // when prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // when on/ off random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // when on/ off repeat button
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // change song when ended song
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // chose a song from playlist
    playlist.onclick = function (event) {
      const songNode = event.target.closest(".song:not(.active)");
      const songOptionNode = event.target.closest(".song__option");
      if (songNode || songOptionNode) {
        // handle when chose song
        if (songNode) {
          _this.currentIndex = songNode.dataset.index * 1;
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        // handle when lick option song
        if (songOptionNode) {
          //
        }
      }
    };
  },
  // scroll To Active Song
  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  // load current song
  loadCurrentSong: function () {
    // console.log(songName, cdThumb, audio);
    songName.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  // next Song
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    console.log(this.currentIndex);
  },
  // prev Song
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    console.log(this.currentIndex);
  },
  // random song
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.songs.length);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  render: function () {
    _this = this;
    const htmls = this.songs.map(function (song, index) {
      return `
        <div class="song ${
          index == _this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div
            class="song__thumb"
            style="background-image: url('${song.image}')"
          ></div>
          <div class="song__body">
            <h3 class="song__body-title">${song.name}</h3>
            <p class="song__body-author">${song.singer}</p>
          </div>
          <div class="song__option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
    });
    playlist.innerHTML = htmls.join("");
  },
  start: function () {
    // define properties for project
    this.defineProperties();
    // handled event
    this.handleEvents();
    // load first song to UI
    this.loadCurrentSong();
    //render playlist
    this.render();
  },
};
app.start();
