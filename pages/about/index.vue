<template>
  <!-- 翻訳が効くようHTMLで書く -->
  <div class="about">
    <div class="about__content">
      <h1 class="about__heading">About IM Cursor</h1>
      <p class="about__copy">Immersive content on Multi-device with Cursor</p>
      <p class="about__note">IM also means "I'm a Cursor"</p>
      <div class="about__desc">
        <p class="about__text">
          IM
          Cursorは、「カーソルの動きによってユーザーに擬似感覚を提示する」というテーマ、「手持ちのデバイスで手軽に体験できる没入型コンテンツ」がコンセプトの制作です。自分の手が水の中にあるかのような、あるいは何かに吸い込まれてしまうような感覚を体験していただけたら嬉しいです。
        </p>
        <p class="about__text">
          PC上で視覚情報により触覚フィードバックをもたらす研究は以前からありますが、このプロダクトではスマートフォンやタブレットでアクセスした場合、カーソルとVirtual
          Padによる独自のタッチインターフェイスを体験することができます。私はこれを既存の研究をタッチデバイスに応用するための手法の一つとして提案します。
        </p>
      </div>
    </div>
    <p class="about__copyright">&copy; 2021 bokoko33</p>
  </div>
</template>

<style lang="scss" scoped>
.about {
  position: fixed;
  width: 100vw;
  height: 100vh;
  // padding: 12vh 6vw;
  letter-spacing: 0.05em;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  @include device-pc {
    line-height: 2;
    padding: 140px 12vw;
    align-items: center;
  }
}

.about__content {
  width: 78vw;
  margin-top: 12vh;
  @include device-pc {
    height: 64vh;
    max-width: $width-max-pc;
    margin-top: 0;
  }
}

.about__heading {
  display: inline-block;
  position: relative;
  font-size: 16px;
  &::after {
    display: inline-block;
    content: '';
    width: 20px;
    height: 1px;
    background-color: white;
    position: absolute;
    right: -30px;
    top: 50%;
  }
  @include device-pc {
    font-size: 26px;
  }
}

.about__copy {
  font-size: 4.9vw;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.05em;
  text-align: center;
  margin-top: 3.4vh;
  @include device-pc {
    font-size: 36px;
    margin-top: 8vh;
  }
}

.about__note {
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  @include device-pc {
    font-size: 18px;
  }
}

.about__desc {
  font-size: 12px;
  line-height: 1.6;
  margin-top: 3.4vh;
  @include device-pc {
    font-size: 16px;
    margin-top: 8vh;
    line-height: 2;
  }
}

.about__text {
  margin-top: 12px;
}

.about__copyright {
  font-size: 12px;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 40px;
}
</style>
