# アニメ管理アプリケーション（バックエンド）

## 🚀 アプリ概要

このバックエンドアプリケーションは、アニメの視聴状況を管理するAPIです。  
ユーザーがアニメの進行状況を管理できるようにするため、**Nest.js** と **PostgreSQL** を利用して実装されています。  
主に**JWTによる認証**と**TypeORM**でデータベース管理を行います。

## 🔑 主要な技術要素

- **Nest.js**: サーバーサイドアプリケーションフレームワーク
- **JWT (JSON Web Token)**: ユーザー認証に使用
- **TypeORM**: データベース接続とORMの管理
- **PostgreSQL**: 使用するデータベース
- **TypeScript**: プロジェクト全体で使用

## 🛠️ 主な機能

1. **ユーザー認証**
   - JWT を使用したトークンベースの認証
   - ユーザー登録 (`/user/regist`)
   - ユーザーログイン (`/user/login`)

2. **アニメ管理**
   - アニメの登録 (`/anime/register`)
   - 視聴中アニメのリスト表示 (`/anime/current/list`)
   - 視聴中アニメのエピソード更新 (`/anime/current/episodeUp`)
   - 視聴中アニメを視聴終了としてマーク (`/anime/current/finishWatching`)
   - 視聴済みアニメのリスト表示 (`/anime/viewed/list`)
   - 視聴済みアニメを再度過去アニメとして登録 (`/anime/viewed/again`)

3. **データベース**
   - PostgreSQL を使用してデータ保存
   - TypeORM によるアニメデータ、ユーザーデータ管理

## 🚀 API エンドポイント

### ユーザー認証
- `POST /user/regist`: ユーザーの新規登録  
- `POST /user/login`: ユーザーのログイン（JWTトークンを取得）

### アニメ管理
- `POST /anime/register`: アニメの新規登録
  - Body: `{ title: string, speed: string, seasonType: string }`
  
- `POST /anime/current/list`: 現在のアニメリストを取得
  - 認証: JWT 必須
  
- `POST /anime/current/episodeUp`: 現在アニメのエピソード更新
  - Body: `{ animeId: number }`
  - 認証: JWT 必須

- `POST /anime/current/finishWatching`: 現在アニメを視聴終了としてマーク
  - Body: `{ animeId: number }`
  - 認証: JWT 必須

- `POST /anime/past/list`: 過去アニメリストを取得
  - 認証: JWT 必須

- `POST /anime/past/episodeUp`: 過去アニメのエピソード更新
  - Body: `{ animeId: number }`
  - 認証: JWT 必須

- `POST /anime/past/finishWatching`: 過去アニメを視聴終了としてマーク
  - Body: `{ animeId: number }`
  - 認証: JWT 必須

- `POST /anime/viewed/list`: 視聴済みアニメリストを取得
  - 認証: JWT 必須

- `POST /anime/viewed/again`: 視聴済みアニメを過去アニメリストに再登録
  - Body: `{ animeId: number }`
  - 認証: JWT 必須

---
