// 末尾にスラッシュがなければスラッシュ付きのルートへ301リダイレクトする
export default function ({ route, redirect }) {
  const path = route.path;
  const hash = route.hash;
  const type = route.query.type;

  if (path.slice(-1) !== '/' && path !== '/404') {
    if (hash) {
      redirect(301, path + '/#' + hash);
    } else if (type) {
      redirect(301, path + '/?type=' + type);
    } else {
      redirect(301, path + '/');
    }
  }
}
