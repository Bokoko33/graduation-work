import Cursor from '../../interface/js/Cursor';
import Common from './Common';

export default class ArtworkGL {
  constructor(props) {
    this.props = props;
    this.init();
  }

  init() {
    // commonにキャンバスdomを渡してシーン作成
    Common.init(this.props.$canvas, this.props.$route);

    // シーンができている必要があるのでここでinit
    Cursor.init();

    // リサイズイベントを登録
    window.addEventListener('resize', this.resize.bind(this));

    // ループ開始
    this.loop();
  }

  resize() {
    Common.resize();
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  render() {
    Cursor.update();
    Common.render();
  }

  transition(route) {
    Common.transition(route);
    Cursor.resetPosition();
  }
}
