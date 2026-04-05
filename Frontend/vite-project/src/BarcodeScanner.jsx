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
          setError("Camera error. Use upload.");
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
            setError("No barcode found in image");
          }
        }
      );
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="bc-container">
      <h2>Barcode Scanner</h2>

      <div className="controls">
        {!isScanning ? (
          <button onClick={() => setIsScanning(true)}>Start Camera</button>
        ) : (
          <button onClick={() => setIsScanning(false)}>Stop</button>
        )}

        <label className="upload">
          Upload
          <input type="file" accept="image/*" onChange={handleUpload} />
        </label>
      </div>

      <div className="scanner-box">
        <div ref={scannerRef} className="camera" />

        {isScanning && <div className="scan-box"></div>}
      </div>

      {preview && <img src={preview} className="preview" />}

      {error && <p className="error">{error}</p>}

      <p className="result">
        <b>Result:</b> {barcode || "None"}
      </p>
    </div>
  );
}