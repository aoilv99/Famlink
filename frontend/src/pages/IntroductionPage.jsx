import React from 'react';
import './IntroductionPage.css';

// ===================================================
// 画像のインポート
// ※ 以下のパスに実際の画像ファイルを配置してください
// ===================================================
import LogoImage from '../assets/titleIcon.png';         // FamLinkロゴアイコン（AuthScreenと共通）
// import ScreenImage1 from '../assets/screen1.png';     // 機能①のスクリーンショット画像
// import ScreenImage2 from '../assets/screen2.png';     // 機能②のスクリーンショット画像
// import ReactLogo from '../assets/tech/react.svg';     // 技術スタック: React
// import NodeLogo from '../assets/tech/node.png';       // 技術スタック: Node.js
// import MysqlLogo from '../assets/tech/mysql.png';     // 技術スタック: MySQL
// import ExpressLogo from '../assets/tech/express.png'; // 技術スタック: Express
// import GithubLogo from '../assets/tech/github.svg';   // 技術スタック: GitHub

/**
 * IntroductionPage コンポーネント
 * 役割: FamLinkアプリの紹介ページ（/introduction）
 * 画像の差し替え方法:
 *   上記のimportコメントを外し、src属性のプレースホルダーを変数に差し替えてください
 *   例: src="/placeholder/screen1" → src={ScreenImage1}
 */
const IntroductionPage = () => {
  return (
    <div className="intro-container">

      {/* ========================================
          ヘッダーセクション
          ロゴ・タグ・キャッチコピーを表示
          ======================================== */}
      <header className="intro-header">
        <div className="intro-header-inner">

          {/* ロゴエリア */}
          <div className="intro-logo-area">
            {/* ロゴアイコン画像 ※差し替え: src={LogoImage} */}
            <img
              src={LogoImage}
              alt="FamLink ロゴ"
              className="intro-logo-icon"
            />
            {/* アプリ名テキスト */}
            <span className="intro-logo-text">FamLink</span>
          </div>

          {/* タグバッジエリア（個人制作 / Webアプリ / モバイル） */}
          <div className="intro-tags">
            <span className="intro-tag intro-tag--personal">個人制作</span>
            <span className="intro-tag intro-tag--web">Webアプリ</span>
            <span className="intro-tag intro-tag--mobile">モバイル</span>
          </div>

          {/* キャッチコピー */}
          <p className="intro-catchcopy">
            家族との距離をもっと近く。<br />
            会いたいをもっと気軽に。
          </p>
        </div>
      </header>

      {/* ========================================
          コンセプトセクション
          「私が目指す家族の在り方は〜」の引用枠
          ======================================== */}
      <section className="intro-concept">
        <div className="intro-concept-inner">
          {/* 前置きテキスト */}
          <p className="intro-concept-label">私が目指す家族の在り方は</p>

          {/* メインメッセージ（引用枠） */}
          <blockquote className="intro-concept-quote">
            「食卓を囲んで他愛もない会話」
          </blockquote>

          {/* 後続テキスト */}
          <p className="intro-concept-suffix">ができる関係</p>
        </div>
      </section>

      {/* ========================================
          機能紹介セクション（赤背景）
          機能①：毎日の感情送信
          機能②：会いたいボタン
          ======================================== */}
      <section className="intro-features">

        {/* --- 機能① 毎日の感情送信 --- */}
        <div className="intro-feature intro-feature--left">
          {/* スクリーンショット画像エリア */}
          <div className="intro-feature-phone">
            {/*
              ※差し替え: <img src={ScreenImage1} alt="毎日の感情送信 画面" className="intro-phone-image" />
              現在はプレースホルダーとして灰色ボックスを表示
            */}
            <div className="intro-phone-placeholder" aria-label="スクリーンショット①のプレースホルダー" />
          </div>

          {/* テキストエリア */}
          <div className="intro-feature-text">
            <p className="intro-feature-number">機能①</p>
            <h2 className="intro-feature-title">毎日の感情送信</h2>
            <p className="intro-feature-desc">
              日々の感情を送信<br />
              小さくても毎日の繋がりを大切に。
            </p>
          </div>
        </div>

        {/* --- 機能② 会いたいボタン --- */}
        <div className="intro-feature intro-feature--right">
          {/* テキストエリア */}
          <div className="intro-feature-text">
            <p className="intro-feature-number">機能②</p>
            <h2 className="intro-feature-title">会いたいボタン</h2>
            <p className="intro-feature-desc">
              会いたいと思ったその瞬間を大事に。<br />
              家族との予定を簡単に繋げます
            </p>
          </div>

          {/* スクリーンショット画像エリア */}
          <div className="intro-feature-phone">
            {/*
              ※差し替え: <img src={ScreenImage2} alt="会いたいボタン 画面" className="intro-phone-image" />
              現在はプレースホルダーとして灰色ボックスを表示
            */}
            <div className="intro-phone-placeholder" aria-label="スクリーンショット②のプレースホルダー" />
          </div>
        </div>
      </section>

      {/* ========================================
          技術スタックセクション
          使用技術のロゴを並べて表示
          ======================================== */}
      <section className="intro-tech">
        <div className="intro-tech-inner">
          <h2 className="intro-tech-title">技術スタック</h2>

          {/* 技術ロゴ一覧 */}
          <div className="intro-tech-logos">

            {/* React ※差し替え: src={ReactLogo} */}
            <div className="intro-tech-item">
              <div className="intro-tech-logo-placeholder" aria-label="React ロゴ" />
            </div>

            {/* Node.js ※差し替え: src={NodeLogo} */}
            <div className="intro-tech-item">
              <div className="intro-tech-logo-placeholder" aria-label="Node.js ロゴ" />
            </div>

            {/* MySQL ※差し替え: src={MysqlLogo} */}
            <div className="intro-tech-item">
              <div className="intro-tech-logo-placeholder" aria-label="MySQL ロゴ" />
            </div>

            {/* Express ※差し替え: src={ExpressLogo} */}
            <div className="intro-tech-item">
              <div className="intro-tech-logo-placeholder" aria-label="Express ロゴ" />
            </div>

            {/* GitHub ※差し替え: src={GithubLogo} */}
            <div className="intro-tech-item">
              <div className="intro-tech-logo-placeholder" aria-label="GitHub ロゴ" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default IntroductionPage;