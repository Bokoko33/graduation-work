import Vue from 'vue';
import style from '~/assets/scss/base/_variable.scss';

class InterFace {
  constructor() {
    this.trackpad = null;

    // カーソル座標
    this.cursorPos = { x: innerWidth * 0.4, y: innerHeight * 0.2 }; // 0,0だと最初に大きく動いてしまう

    // トラックパッド内の座標
    this.trackPos = { x: 0, y: 0 };

    // ドラッグ中か（トラックパッド）
    this.isDrag = false;

    // マウスダウン中か
    this.isMousePressed = false;

    // トラックパッド感度（1で完全に同距離）
    this.sensitivity = 3;

    this.breakPoint = Number(style.breakPointTablet.replace('px', ''));

    // クリックイベントを配列で持っておく
    this.clickEventList = [];

    this.cursorInit();
    this.trackPadInit();
  }

  cursorInit() {
    window.addEventListener('mousedown', (e) => {
      this.isMousePressed = true;
    });
    window.addEventListener('mousemove', (e) => {
      this.mouseMoved(e);
    });
    window.addEventListener('mouseup', (e) => {
      this.isMousePressed = false;
    });
    document.body.addEventListener('click', (e) => {
      this.handleEventList();
    });
  }

  mouseMoved(e) {
    // スマホ時は実行しない
    if (window.innerWidth < this.breakPoint) return;
    this.cursorPos.x = e.clientX;
    this.cursorPos.y = e.clientY;
  }

  trackPadInit() {
    this.trackpad = document.getElementById('trackpad');
    // トラックパッド操作時のイベントを登録
    this.trackpad.addEventListener('touchstart', (e) => {
      // マウスダウンでドラッグ開始、現在の座標をprevに格納
      this.trackPos.x = e.touches[0].clientX;
      this.trackPos.y = e.touches[0].clientY;
      this.isMousePressed = true;
    });
    this.trackpad.addEventListener('touchmove', (e) => {
      e.preventDefault(); // スクロールを防止
      this.trackPadMoved(e);
    });
    this.trackpad.addEventListener('touchend', (e) => {
      this.isMousePressed = false;
    });
    this.trackpad.addEventListener('click', (e) => {
      this.handleEventList();
    });
  }

  trackPadMoved(e) {
    // PC時は実行しない
    if (window.innerWidth > this.breakPoint) return;

    // 移動量を求める
    const moveX = e.touches[0].clientX - this.trackPos.x;
    const moveY = e.touches[0].clientY - this.trackPos.y;

    // カーソル座標に移動量を加える
    this.cursorPos.x += moveX * this.sensitivity;
    this.cursorPos.y += moveY * this.sensitivity;

    // 現在のトラックパッド座標をセット
    this.trackPos.x = e.touches[0].clientX;
    this.trackPos.y = e.touches[0].clientY;
  }

  update() {
    // 画面端から見切れない処理
    if (this.cursorPos.x < 0) {
      this.cursorPos.x = 0;
    }
    if (this.cursorPos.x > window.innerWidth) {
      this.cursorPos.x = window.innerWidth;
    }
    if (this.cursorPos.y < 0) {
      this.cursorPos.y = 0;
    }
    if (this.cursorPos.y > window.innerHeight) {
      this.cursorPos.y = window.innerHeight;
    }
  }

  setClickEvent(callback) {
    this.clickEventList.push(callback);
  }

  handleEventList() {
    // リスト内のメソッドを実行。これをaddEventListenerで紐付けている
    for (let i = 0; i < this.clickEventList.length; i++) {
      this.clickEventList[i]();
    }
  }
}

Vue.prototype.$interFace = new InterFace();
