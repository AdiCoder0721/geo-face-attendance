import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

/**
 * Reusable face component for capturing or verifying faces.
 *
 * Props:
 *   - userDescriptor: Array<number> (optional) - descriptor to verify against
 *   - onCapture: function(descArray) (optional) - called when user clicks capture
 *   - onMatch: function(boolean) (optional) - called when verification state changes
 */
const FaceRecognition = ({ userDescriptor, onCapture, onMatch }) => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [lastMatch, setLastMatch] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded && userDescriptor && onMatch) {
      const interval = setInterval(() => verifyLoop(userDescriptor), 2000);
      return () => clearInterval(interval);
    }
  }, [modelsLoaded, userDescriptor]);

  // live face presence watcher - updates error immediately when face appears/disappears
  useEffect(() => {
    if (!modelsLoaded) return;
    const watcher = setInterval(async () => {
      if (!videoRef.current) return;
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
      if (detection) {
        if (error) setError("");
      } else {
        setError("No face detected");
      }
    }, 1000);
    return () => clearInterval(watcher);
  }, [modelsLoaded, error]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("camera error", err));
  };

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(`${MODEL_URL}/tiny_face_detector`);
    await faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`);
    await faceapi.nets.faceRecognitionNet.loadFromUri(`${MODEL_URL}/face_recognition`);
    setModelsLoaded(true);
  };

  const captureDescriptor = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!detection) {
      setError("No face detected");
      return null;
    }
    // clear error when we successfully detect a face
    if (error) setError("");
    return detection.descriptor;
  };

  const handleCapture = async () => {
    if (onCapture) {
      const desc = await captureDescriptor();
      if (desc) onCapture(Array.from(desc));
    }
  };

  const verifyLoop = async (targetDesc) => {
    const desc = await captureDescriptor();
    if (!desc) {
      onMatch(false);
      setLastMatch(false);
      return;
    }
    const distance = faceapi.euclideanDistance(desc, targetDesc);
    const match = distance < 0.6;
    if (match !== lastMatch) {
      onMatch(match);
      setLastMatch(match);
    }
  };

  return (
    <div>
      <h2>Face Scanner</h2>
      <video ref={videoRef} autoPlay muted style={{width:'100%',maxWidth:'400px',borderRadius:'4px'}} />
      {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
      {onCapture && (
        <div style={{ marginTop: 8 }}>
          <button onClick={handleCapture}>Capture Face</button>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
