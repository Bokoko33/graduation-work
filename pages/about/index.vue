<template>
  <!-- 翻訳が効くようHTMLで書く -->
  <div class="about">
    <div class="about__content">
      <h1 class="about__heading">
        IM Cursor is<br />an Immersive content on Multi-device with Cursor
      </h1>
      <p class="about__note">
        IM = "Immersive content on Multi-devise" & "I' m a Cursor"
      </p>
      <p class="about__text">
        IM
        Cursorは、「カーソルの動きによってユーザーに擬似感覚を提示する」というテーマ、「手持ちのデバイスで手軽に体験できる没入型コンテンツ」がコンセプトの制作です。自分の手が水の中にあるかのような、あるいは何かに吸い込まれてしまうような感覚を体験していただけたらうれしいです。
      </p>
      <p class="about__text">
        PC上で視覚情報により触覚フィードバックをもたらす研究は以前からありますが、このプロダクトではスマートフォンやタブレットでアクセスした場合、カーソルとVirtual
        Padによる独自のタッチインターフェイスを体験することができます。私はこれを既存の研究をタッチデバイスに応用するための手法の一つとして提案します。
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.about {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
}

.about__content {
  width: 70vw;
  max-width: $width-max-pc;
  height: 54vh;
}

.about__heading {
  font-size: 26px;
}

.about__note {
  font-size: 18px;
  margin-top: 2vh;
  font-weight: 700;
}

.about__text {
  font-size: 16px;
  line-height: 2;
  margin-top: 5vh;
}
</style>
