Three.js及び、Shaderに関する事項(9/25)
分解・解釈
### 要素
- オブジェクトの形
    - BoxGeometry、Cylinderを組み合わせたCrossCylinder、Sphere、Coneを上下に組み合わせたdoubleCone、使用予定のIcosahedronGeometry。
    - 形に関しては、『The Structures of Letters~』を参考に複数の直方体が組み合わさった形へと変更が必要？
    - 動詞を感知する言語モデルがあれば、動的な変形も試したい。

- Material
    - Shaderを反映
    - u_timeや、u_mouse、u_opacity(koh_sentiment_score)などがuniform変数として存在
    - varying変数として、vUvやvNormal、vPosition、vDisplacement(変位)など
    - u_timeは何に用いる？A.動的なグラデーション。なぜ？感情の流動性を表現したい。
    - u_mouseは何に用いる？A.未定
    - u_opacityはgl_FragColorの透明度に使用。

- Mesh
    - 基本的にGeometryとMaterialをそのまま代入。
    - positionはXが、投稿時間のminutes(0~59)、Yが、投稿時間のsecondsの部分(0~59)、Ｚが、投稿時間の時間の部分(1~24)。それぞれを-1500~1500にスケーリングし、配置。これにより、3次元的なタイムラインを形成する。
    - dayは？-一日ごとにキャンパスを更新する。
    - 懸念として、Mesh同士が重ならなった場合、メッセージの区別がしづらくなる。なので、見やすさのために、一画面に表示する数を調節する。

- Background.tsで決定しているカメラや背景
    - カメラの挙動が不自然なので、修正が必要。
        - 配置位置をオブジェクトから離すことで対処可能か。
    - 背景は現在、空をイメージして、水色を選定。
        - Shaderの色遣いによって、変更可能性あり。

### 決定事項
- 8種の感情ラベルによって、形を決定すること
    - 何故？
- 3種のポジネガラベルによって、Shaderを切り替えること。
    - 何故？
- 文字数は、そのままオブジェクトの大きさになる。文量をわかりやすく表現する。
- 意味解釈はどうするの？

### その他
- ページを開き続けると、動作が重たくなるので、修正。

### 手順
1. backgroundのカメラ・背景の調整
    - カメラの不具合の修正
        - this.controls.target.set(0, 0, -1250);として設定し、解消。
    - 背景の調整
    - canvasサイズの検討
2. Shaderの修正
    - vertexShader
    - fragmentShader
3. Geometryの修正
    - 『The Structures of Letters~』に基づいた形の検討