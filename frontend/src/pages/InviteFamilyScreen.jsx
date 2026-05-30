import React, { useState, useEffect, useRef } from "react";
import "./InviteFamilyScreen.css";
import LogoImage from "../assets/titleIcon.png";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

const InviteFamilyScreen = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const savedCode = localStorage.getItem("inviteCode");
    if (savedCode) {
      setInviteCode(savedCode);
    } else {
      console.warn("招待コードが見つかりません");
    }
  }, []);

  // QR表示トグル時にcanvasへ描画
  useEffect(() => {
    if (showQR && inviteCode && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, inviteCode, {
        width: 200,
        margin: 2,
        color: {
          dark: "#a52a44",
          light: "#ffffff",
        },
      });
    }
  }, [showQR, inviteCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const email = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/families/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            family_id: inviteCode,
            family_name: "我が家",
            email: email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.family_id) localStorage.setItem("familyId", data.family_id);
        navigate("/home");
      } else {
        const errorData = await response.json().catch(() => ({ message: "不明なエラー" }));
        alert("作成失敗: " + (errorData.message || "サーバーエラー"));
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert("サーバーに接続できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => navigate("/family-select");

  return (
    <div className="invite-family-container">
      <div className="invite-family-decoration invite-family-decoration-top-left">
        <div className="invite-family-blob invite-family-blob-1"></div>
        <div className="invite-family-blob invite-family-blob-2"></div>
      </div>
      <div className="invite-family-decoration invite-family-decoration-bottom-right">
        <div className="invite-family-blob invite-family-blob-3"></div>
        <div className="invite-family-blob invite-family-blob-4"></div>
      </div>

      <div className="invite-family-content">
        <div className="invite-family-logo-section">
          <div className="invite-family-logo-placeholder">
            <img src={LogoImage} alt="FamLink Logo" />
          </div>
        </div>

        <div className="invite-family-description">
          <h2 className="invite-family-title">家族を招待する</h2>
          <p className="invite-family-description-text">
            この招待コードを家族に
            <br />
            共有してください
          </p>
        </div>

        <div className="invite-code-section">
          <div className="invite-code-display">
            <span className="invite-code-text">{inviteCode}</span>
          </div>

          <button
            type="button"
            className={`copy-button ${copied ? "copied" : ""}`}
            onClick={handleCopyCode}
          >
            {copied ? "コピーしました！" : "コピーする"}
          </button>

          {/* QRコード表示トグル */}
          <button
            type="button"
            className="qr-toggle-button"
            onClick={() => setShowQR((prev) => !prev)}
          >
            {showQR ? "QRコードを閉じる" : "📷 QRコードを表示"}
          </button>

          {/* QRコードCanvas */}
          {showQR && (
            <div className="qr-code-wrapper">
              <canvas ref={canvasRef} className="qr-canvas" />
              <p className="qr-hint">スキャンして参加できます</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`invite-family-complete-button ${isSubmitting ? "disabled" : ""}`}
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "処理中..." : "完了"}
        </button>

        <button type="button" className="invite-family-back-link" onClick={handleGoBack}>
          ← 戻る
        </button>
      </div>
    </div>
  );
};

export default InviteFamilyScreen;