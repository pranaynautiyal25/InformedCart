import React, { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import "./BarcodeScanner.css";

export default function BarcodeScanner() {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!isScanning) return;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        locate: true,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "code_128_reader",
          ],
        },
      },
      (err) => {
        if (err) {
          setError("Camera error. Please try uploading an image instead.");
          return;
        }
        Quagga.start();
      }
    );

    const onDetected = (res) => {
      const code = res?.codeResult?.code;
      if (!code) return;

      setBarcode(code);
      setIsScanning(false);
      Quagga.stop();
      Quagga.offDetected(onDetected);
    };

    Quagga.onDetected(onDetected);

    return () => {
      try {
        Quagga.stop();
        Quagga.offDetected(onDetected);
      } catch { }
    };
  }, [isScanning]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBarcode("");
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const img = reader.result;
      setPreview(img);

      Quagga.decodeSingle(
        {
          src: img,
          numOfWorkers: 0,
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "code_128_reader",
            ],
          },
        },
        (result) => {
          if (result && result.codeResult) {
            setBarcode(result.codeResult.code);
          } else {
            setError("No barcode found in image.");
          }
        }
      );
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="bc-wrapper">

      {/* Controls row */}
      <div className="bc-controls">
        {!isScanning ? (
          <button className="bc-btn bc-btn-primary" onClick={() => setIsScanning(true)}>
            Start Camera
          </button>
        ) : (
          <button className="bc-btn bc-btn-danger" onClick={() => setIsScanning(false)}>
            Stop Camera
          </button>
        )}

        <label className="bc-btn bc-btn-secondary">
          Upload Image
          <input type="file" accept="image/*" onChange={handleUpload} hidden />
        </label>
      </div>

      {/* Camera view */}
      {isScanning && (
        <div className="bc-scanner-box">
          <div ref={scannerRef} className="bc-camera" />
          <div className="bc-scan-overlay" />
        </div>
      )}

      {/* Image preview after upload */}
      {preview && !isScanning && (
        <div className="bc-preview-box">
          <img src={preview} alt="Uploaded barcode" className="bc-preview" />
        </div>
      )}

      {/* Error */}
      {error && <p className="bc-error">{error}</p>}

      {/* Result */}
      <div className="bc-result">
        <span className="bc-result-label">DETECTED BARCODE</span>
        <span className="bc-result-value">{barcode || "—"}</span>
      </div>

    </div>
  );
}