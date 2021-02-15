import Cursor from '../../interface/js/Cursor';
import Common from './Common';
import { initTexture } from './textures';
import { setDevice, setImageShrinkRate, setObjectSizeRate } from './state';

export default class ArtworkGL {
  constructor(props) {
    this.props = props;
    this.init();
  }

  init() {
    // 画像読み込み
    initTexture();

    // 先にデバイス情報を渡し、画像、オブジェクトの縮小率をセット
    setDevice(this.props.isMobile);
    setImageShrinkRate(this.props.isMobile);
    setObjectSizeRate(this.props.isMobile);

    // commonにキャンバスdomを渡してシーン作成
    Common.init(this.props.$canvas, this.props.path);

    // シーンができている必要があるのでここでinit
    Cursor.init(this.props.path);

    // リサイズイベントを登録
    window.addEventListener('resize', this.resize.bind(this));

    // ループ開始
    this.loop();
  }

  resize() {
    Common.resize();
  }

  // デバイス切り替え時のみ
  changeDevice(isMobile) {
    setDevice(isMobile);
    Common.changeDevice(isMobile);
  }

  loop() {
    Cursor.update();
    Common.update();
    requestAnimationFrame(this.loop.bind(this));
  }

  // transition(route) {
  //   Common.transition(route);
  //   Cursor.resetForce(route);
  //   Cursor.resetPosition();
  // }
}
