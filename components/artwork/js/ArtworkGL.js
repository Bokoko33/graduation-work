import Cursor from '../../interface/js/Cursor';
import Common from './Common';
import { initTexture } from './textures';

export default class ArtworkGL {
  constructor(props) {
    this.props = props;
    this.init();
  }

  init() {
    // 画像読み込み
    initTexture();

    // commonにキャンバスdomを渡してシーン作成
    Common.init(this.props.$canvas, this.props.$route);

    // シーンができている必要があるのでここでinit
    Cursor.init(this.props.$route);

    // リサイズイベントを登録
    window.addEventListener('resize', this.resize.bind(this));

    // ループ開始
    this.loop();
  }

  resize() {
    Common.resize();
  }

  loop() {
    Cursor.update();
    Common.update();
    requestAnimationFrame(this.loop.bind(this));
  }

  transition(route) {
    Common.transition(route);
    Cursor.resetForce(route);
    Cursor.resetPosition();
  }
}
