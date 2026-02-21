import React, { useRef, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const modelRef = useRef(null);
  const objectsRef = useRef([]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let animationId;

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      modelRef.current = await cocoSsd.load();

      detect();
      draw();
    };

    // 🔥 MULTI PERSON DETECTION
    const detect = async () => {
      if (
        modelRef.current &&
        videoRef.current &&
        videoRef.current.readyState === 4
      ) {
        const preds = await modelRef.current.detect(videoRef.current);

        // 🔥 FILTER ONLY PEOPLE
        objectsRef.current = preds
          .filter((p) => p.class === "person")
          .map((p) => ({
            bbox: p.bbox,
            x: p.bbox[0] + p.bbox[2] / 2,
            y: p.bbox[1] + p.bbox[3] / 2,
          }));
      }

      requestAnimationFrame(detect);
    };

    // 🎬 MULTI FOCUS DRAW
    const draw = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!video || video.readyState !== 4) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🎬 BLUR FULL BACKGROUND
      ctx.filter = "blur(25px)";
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 🎯 CLEAR MULTIPLE FOCUS AREAS
      ctx.save();

      objectsRef.current.forEach((obj) => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 130, 0, Math.PI * 2);
        ctx.clip();

        ctx.filter = "none";
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.save();
      });

      ctx.restore();

      // 🔴 DRAW FOCUS UI
      objectsRef.current.forEach((obj) => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 130, 0, Math.PI * 2);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(draw);
    };

    start();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // 🎥 RECORDING
  const startRecording = () => {
    const stream = canvasRef.current.captureStream(30);
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "multifocus.webm";
      a.click();
    };
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🎬 CineAI Multi-Focus Cinematic Camera</h2>

      <video ref={videoRef} style={{ display: "none" }} />

      <canvas ref={canvasRef} width="640" height="480" />

      <div style={{ marginTop: "10px" }}>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop & Download</button>
      </div>
    </div>
  );
}

export default App;