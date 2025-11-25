import React, { useState, useEffect } from 'react';
import Title from "./pages/Title.jsx";     // アプリ起動時のローディング画面
import HomePage from "./pages/HomePage.jsx"; // 認証済み（ログイン後）のメインコンテンツ
import AuthScreen from "./pages/AuthScreen.jsx"; // 未認証（ログイン前）の画面

function App() {
  // === 状態管理 (State Hooks) ===
  // 画面の表示を制御する主要な状態
  const [isLoading, setIsLoading] = useState(true);          // ① 初期ロード・認証チェック中か？
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ② ユーザーはログイン済みか？

  // === 副作用 (Effect Hook) ===
  // アプリ起動時に一度だけ実行される初期化処理
  useEffect(() => {
    // 1. 認証トークンの確認
    // ブラウザに前回のログイン情報（authToken）が残っているかチェックする
    const userToken = localStorage.getItem('authToken'); 
    
    if (userToken) {
        // トークンがあれば認証済みとみなし、状態を更新する
        setIsAuthenticated(true); 
        // ※ 実際はここでサーバーにトークンの有効性を確認する
    }
    
    // 2. ローディング完了タイマー
    // スプラッシュ/タイトル画面を3秒間表示するための時間差処理
    const timer = setTimeout(() => {
      setIsLoading(false); // 3秒後、ローディングを完了（画面切り替えを許可）
    }, 3000); 

    // クリーンアップ処理
    // コンポーネントが破棄される際にタイマーを確実に解除する
    return () => clearTimeout(timer);
    
  }, []); // [] により、コンポーネントの初回マウント時に一度だけ実行される

  // === 条件付きレンダリング (画面の振り分け) ===

  // 最優先: ローディングが完了するまで Title 画面を表示
  if (isLoading) {
    return <Title />;
  }

  // ローディング完了後: 認証状態に基づいて画面を切り替える
  // 1. 認証済みの場合
  if (isAuthenticated) {
    return <HomePage />;
  }

  // 2. 未認証の場合
  return <AuthScreen />;
}

export default App;