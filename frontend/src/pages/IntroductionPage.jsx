import React from 'react';
import './IntroductionPage.css';

// ===================================================
// 画像のインポート
// ※ 以下のパスに実際の画像ファイルを配置してください
// ===================================================
import LogoImage from '../assets/titleIcon.png';         // FamLinkロゴアイコン（AuthScreenと共通）
import ScreenImage1 from '../assets/screen1.png';     // 機能①のスクリーンショット画像
import ScreenImage2 from '../assets/screen2.png';     // 機能②のスクリーンショット画像
import ReactLogo from '../assets/tech/react.png';     // 技術スタック: React
import NodeLogo from '../assets/tech/node.png';       // 技術スタック: Node.js
import MysqlLogo from '../assets/tech/mysql.png';     // 技術スタック: MySQL
import RailwayLogo from '../assets/tech/railway.png'; // 技術スタック: Railway
import GithubLogo from '../assets/tech/github.png';   // 技術スタック: GitHub

/**
 * IntroductionPage コンポーネント
 * 役割: FamLinkアプリの紹介ページ（/introduction）
 *
 * レイアウト構成:
 *   1. ヘッダー: タグバッジ行 → ロゴアイコン（左大）＋アプリ名・キャッチコピー（右）
 *   2. コンセプト: 引用枠（「食卓を囲んで...」）
 *   3. 機能紹介: 赤背景、機能①（画像左）・機能②（画像右）
 *   4. 技術スタック: ロゴ横並び
 */
const IntroductionPage = () => {
    return (
        <div className="intro-container">

            {/* ========================================
          ヘッダーセクション
          上段: タグバッジ（個人制作 / Webアプリ / モバイル）
          下段: ロゴアイコン（左・大）＋ FamLink テキスト＋キャッチコピー（右）
          ======================================== */}
            <header className="intro-header">
                <div className="intro-header-inner">

                    {/* --- 上段: タグバッジ行 --- */}
                    <div className="intro-tags">
                        <span className="intro-tag intro-tag--personal">個人制作</span>
                        <span className="intro-tag intro-tag--web">Webアプリ</span>
                        <span className="intro-tag intro-tag--mobile">モバイル</span>
                    </div>

                    {/* --- 下段: ロゴアイコン（左）＋テキストブロック（右）--- */}
                    <div className="intro-logo-row">

                        {/* ロゴアイコン画像（左側・大きく表示） */}
                        <img
                            src={LogoImage}
                            alt="FamLink ロゴ"
                            className="intro-logo-icon"
                        />

                        {/* アプリ名＋キャッチコピー（右側） */}
                        <div className="intro-logo-text-block">
                            {/* アプリ名テキスト */}
                            <span className="intro-logo-text">FamLink</span>
                            {/* キャッチコピー */}
                            <p className="intro-catchcopy">
                                家族との距離をもっと近く。<br />
                                会いたいをもっと気軽に。
                            </p>
                        </div>
                    </div>

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
          機能①：スマホ画像が左、テキストが右
          機能②：テキストが左、スマホ画像が右
          ======================================== */}
            <section className="intro-features">

                {/* --- 機能① 毎日の感情送信（画像：左） --- */}
                <div className="intro-feature intro-feature--left">

                    {/* スクリーンショット画像（左側） */}
                    <div className="intro-feature-phone">
                        <img
                            src={ScreenImage1}
                            alt="毎日の感情送信 画面"
                            className="intro-phone-image"
                        />
                    </div>

                    {/* テキスト（右側） */}
                    <div className="intro-feature-text">
                        <p className="intro-feature-number">機能①</p>
                        <h2 className="intro-feature-title">毎日の感情送信</h2>
                        <p className="intro-feature-desc">
                            日々の感情を送信<br />
                            小さくても毎日の繋がりを大切に。
                        </p>
                    </div>
                </div>

                {/* --- 機能② 会いたいボタン（画像：右） --- */}
                <div className="intro-feature intro-feature--right">

                    {/* テキスト（左側） */}
                    <div className="intro-feature-text">
                        <p className="intro-feature-number">機能②</p>
                        <h2 className="intro-feature-title">会いたいボタン</h2>
                        <p className="intro-feature-desc">
                            会いたいと思ったその瞬間を大事に。<br />
                            家族との予定を簡単に繋げます
                        </p>
                    </div>

                    {/* スクリーンショット画像（右側） */}
                    <div className="intro-feature-phone">
                        <img
                            src={ScreenImage2}
                            alt="会いたいボタン 画面"
                            className="intro-phone-image"
                        />
                    </div>
                </div>
            </section>

            {/* ========================================
          技術スタックセクション
          使用技術のロゴを横並びで表示
          ======================================== */}
            <section className="intro-tech">
                <div className="intro-tech-inner">
                    <h2 className="intro-tech-title">技術スタック</h2>

                    {/* 技術ロゴ一覧 */}
                    <div className="intro-tech-logos">

                        {/* React */}
                        <div className="intro-tech-item">
                            <img src={ReactLogo} alt="React" className="intro-tech-logo" />
                        </div>

                        {/* Node.js */}
                        <div className="intro-tech-item">
                            <img src={NodeLogo} alt="Node.js" className="intro-tech-logo" />
                        </div>

                        {/* MySQL */}
                        <div className="intro-tech-item">
                            <img src={MysqlLogo} alt="MySQL" className="intro-tech-logo" />
                        </div>

                        {/* Railway */}
                        <div className="intro-tech-item">
                            <img src={RailwayLogo} alt="Railway" className="intro-tech-logo" />
                        </div>

                        {/* GitHub */}
                        <div className="intro-tech-item">
                            <img src={GithubLogo} alt="GitHub" className="intro-tech-logo" />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default IntroductionPage;