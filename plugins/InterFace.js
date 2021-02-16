import Vue from 'vue';
import style from '~/assets/scss/base/_variable.scss';

class InterFace {
  constructor() {
    this.trackpad = null;
    this.trackpadRect = null;

    // カーソル座標
    this.cursorPos = { x: innerWidth * 0.4, y: innerHeight * 0.1 }; // 0,0だと最初に大きく動いてしまう、見辛い
    // 前フレームの座標
    this.prevPos = { x: this.cursorPos.x, y: this.cursorPos.y };
    // フレーム間の移動ベクトル
    this.moveVec = { x: 0, y: 0 };

    // トラックパッド内の座標
    this.trackPos = { x: 0, y: 0 };

    // トラックパッド自身の画面端との余白
    this.trackpadMargin = 10;

    // ドラッグ中か（トラックパッド）
    this.isDrag = false;

    // マウスダウン中か
    this.isMousePressed = false;
    // マウスムーブ中か
    this.isMouseMoving = false;

    // ダブルタップしたか（タッチのみ）
    this.tapCount = 0;
    this.doubleTaped = false;

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
    this.trackpadRect = this.trackpad.getBoundingClientRect();

    // 位置を右下に設定
    const initPos = {
      x: window.innerWidth - this.trackpad.clientWidth,
      y: window.innerHeight - this.trackpad.clientHeight,
    };
    const initialX = initPos.x - this.trackpadMargin;
    const initialY = initPos.y - this.trackpadMargin;
    this.trackpad.style.transform = `translate(${initialX}px,${initialY}px)`;

    // トラックパッド操作時のイベントを登録
    this.trackpad.addEventListener('touchstart', (e) => {
      // マウスダウンでドラッグ開始、現在の座標をprevに格納
      this.trackPos.x = e.touches[0].clientX;
      this.trackPos.y = e.touches[0].clientY;
      this.isMousePressed = true;

      // 二本指のときダブルタップ判定にしない
      if (e.touches.length === 1) {
        this.checkDoubleTap();
      }
    });
    this.trackpad.addEventListener('touchmove', (e) => {
      e.preventDefault(); // スクロールを防止

      // 一本指でカーソル移動、二本でトラックパッドそのもの移動
      if (e.touches.length === 1) {
        this.trackPadMoved(e);
      } else if (e.touches.length === 2) {
        this.moveTrackPadPosition(e);
      }
    });
    this.trackpad.addEventListener('touchend', (e) => {
      this.isMousePressed = false;
      this.doubleTaped = false;
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

  moveTrackPadPosition(e) {
    const pos1 = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    const pos2 = {
      x: e.touches[1].clientX,
      y: e.touches[1].clientY,
    };
    const centerOfTwoFinger = {
      x: (pos1.x + pos2.x) / 2,
      y: (pos1.y + pos2.y) / 2,
    };

    const movedX = centerOfTwoFinger.x - this.trackpadRect.width / 2;
    const movedY = centerOfTwoFinger.y - this.trackpadRect.height / 2;

    this.trackpad.style.transform = `translate(${movedX}px,${movedY}px)`;

    // rectを更新
    this.trackpadRect = this.trackpad.getBoundingClientRect();

    // 画面外には出ないように調整
    let fixedX, fixedY;
    if (movedX < this.trackpadMargin) {
      fixedX = this.trackpadMargin;
    } else if (
      movedX + this.trackpadRect.width >
      window.innerWidth - this.trackpadMargin
    ) {
      fixedX =
        window.innerWidth - this.trackpadMargin - this.trackpadRect.width;
    }

    if (movedY < this.trackpadMargin) {
      fixedY = this.trackpadMargin;
    } else if (
      movedY + this.trackpadRect.height >
      window.innerHeight - this.trackpadMargin
    ) {
      fixedY =
        window.innerHeight - this.trackpadMargin - this.trackpadRect.height;
    }

    const newX = fixedX || movedX;
    const newY = fixedY || movedY;
    this.trackpad.style.transform = `translate(${newX}px,${newY}px)`;
  }

  checkDoubleTap() {
    // ダブルタップしたかどうかの判定、タッチデバイスのみ
    if (this.tapCount) {
      // すでにタップカウントがある場合はこのタップでダブルクリック判定
      this.doubleTaped = true;
      this.tapCount = 0;
    } else {
      this.tapCount = 1;
      setTimeout(() => {
        this.tapCount = 0;
      }, 350);
    }
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

    // 動いているか、止まっているか
    // 移動ベクトルを計算
    this.moveVec.x = this.cursorPos.x - this.prevPos.x;
    this.moveVec.y = this.cursorPos.y - this.prevPos.y;
    // 絶対値から移動量を取得
    if (Math.abs(this.moveVec.x) < 0.01 && Math.abs(this.moveVec.y)) {
      this.isMouseMoving = false;
    } else {
      this.isMouseMoving = true;
    }

    this.prevPos.x = this.cursorPos.x;
    this.prevPos.y = this.cursorPos.y;
  }

  detectCollision(x, y, width, height) {
    if (
      this.cursorPos.x > x &&
      this.cursorPos.x < x + width &&
      this.cursorPos.y > y &&
      this.cursorPos.y < y + height
    ) {
      return true;
    } else {
      return false;
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
