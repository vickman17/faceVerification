import React, { useRef } from 'react';
import { Camera } from '@capacitor/camera';
import axios from 'axios';

const Home : React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const verifyFace = async (imageBase64: string) => {
    const API_KEY = '7bSM-jAZiEekUdU1blHBLh0YSHxs9aSbueBGaDdlZaOVOyDvC6Al_ntyBaIyjNWR';
    const API_SECRET ='-jAZiEekUdU1blHBLh0YSHxs9aSbueBG';
    const API_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare';

    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('image_base64_1', imageBase64);
    formData.append('image_base64_2', 'BASE64_IMAGE_OF_REFERENCE_PERSON');

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error verifying face:', error);
      return null;
    }
  };

  const captureAndVerify = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL('image/jpeg');
        await verifyFace(capturedImage.split(',')[1]);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} width="100%" height="auto" autoPlay />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureAndVerify}>Verify Face</button>
    </div>
  );
};

export default Home;
