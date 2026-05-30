import React, { useState, useEffect, useRef } from 'react';
import './JoinFamilyScreen.css';
import LogoImage from '../assets/titleIcon.png';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const JoinFamilyScreen = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const scannerRef = useRef(null);

  // スキャナーの起動・停止
  useEffect(() => {
    if (scanning) {
      const qrScanner = new Html5Qrcode('qr-reader');
      scannerRef.current = qrScanner;
      setScanError('');

      qrScanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            // スキャン成功
            setInviteCode(decodedText);
            setScanning(false);
            qrScanner.stop().catch(() => {});
          },
          () => {} // スキャン中のエラーは無視
        )
        .catch((err) => {
          console.error('カメラ起動エラー:', err);
          setScanError('カメラを起動できませんでした。\nカメラの使用を許可してください。');
          setScanning(false);
        });
    } else {
      // scanning が false になったらスキャナーを停止
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    }

    return () => {
      // アンマウント時にクリーンアップ
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const handleJoin = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('authToken');

    if (!email) {
      alert('ログインが必要です');
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/families/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ family_id: inviteCode.trim(), email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.family_id) localStorage.setItem('familyId', data.family_id);
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert('参加失敗: ' + (errorData.message || 'コードが正しくありません'));
      }
    } catch (error) {
      console.error('通信エラー:', error);
      alert('サーバーに接続できませんでした');
    }
  };

  const handleGoBack = () => navigate('/family-select');

  return (
    <div className="join-family-container">
      <div className="join-family-decoration join-family-decoration-top-left">
        <div className="join-family-blob join-family-blob-1"></div>
        <div className="join-family-blob join-family-blob-2"></div>
      </div>
      <div className="join-family-decoration join-family-decoration-bottom-right">
        <div className="join-family-blob join-family-blob-3"></div>
        <div className="join-family-blob join-family-blob-4"></div>
      </div>

      <div className="join-family-content">
        <div className="join-family-logo-section">
          <div className="join-family-logo-placeholder">
            <img src={LogoImage} alt="FamLink Logo" />
          </div>
        </div>

        <div className="join-family-description">
          <h2 className="join-family-title">家族に入る</h2>
          <p className="join-family-description-text">
            招待コードを入力するか
            <br />
            QRコードをスキャンしてください
          </p>
        </div>

        <form className="join-family-form" onSubmit={handleJoin}>
          <div className="join-family-form-group">
            <label htmlFor="inviteCode" className="join-family-label">
              招待コード
            </label>
            <input
              type="text"
              id="inviteCode"
              className="join-family-input"
              placeholder="例: ABC123XYZ"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          </div>

          {/* QRスキャンボタン */}
          <button
            type="button"
            className={`qr-scan-button ${scanning ? 'scanning' : ''}`}
            onClick={() => setScanning((prev) => !prev)}
          >
            {scanning ? '⏹ スキャンを停止' : '📷 QRコードをスキャン'}
          </button>

          {/* エラー表示 */}
          {scanError && <p className="qr-scan-error">{scanError}</p>}

          {/* QRリーダー領域（html5-qrcodeがここにカメラを描画） */}
          <div
            id="qr-reader"
            className={`qr-reader-area ${scanning ? 'active' : ''}`}
          />

          {/* スキャン成功時のプレビュー */}
          {!scanning && inviteCode && (
            <p className="qr-scanned-hint">✅ コードを取得しました</p>
          )}

          <button type="submit" className="join-family-submit-button">
            参加する
          </button>
        </form>

        <button type="button" className="join-family-back-link" onClick={handleGoBack}>
          ← 戻る
        </button>
      </div>
    </div>
  );
};

export default JoinFamilyScreen;