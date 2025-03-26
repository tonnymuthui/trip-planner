import React, { useEffect, useRef } from "react";
import logSheetImage from "./blank-paper-log.png";

const LogSheetComponent = ({ logs = [], remarks = [] }) => {
  const canvasRef = useRef(null);

  // Function to determine Y position for different statuses
  const calculateYPosition = (status) => {
    switch (status) {
      case "offDuty":
        return 50; // Adjust based on image
      case "sleeper":
        return 100;
      case "driving":
        return 150;
      case "onDuty":
        return 200;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = logSheetImage;

    image.onload = () => {
      // Clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw log sheet image as the background
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Ensure logs exist before iterating
      if (logs.length === 0) {
        console.warn("No log data available");
        return;
      }

      // Overlay log data
      logs.forEach((log) => {
        if (log.startTime !== undefined && log.endTime !== undefined && log.status !== undefined) {
          const startX = log.startTime * (canvas.width / 24); // Scale to canvas width
          const endX = log.endTime * (canvas.width / 24);
          const y = calculateYPosition(log.status);

          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Ensure remarks exist before iterating
      if (remarks.length === 0) {
        console.warn("No remarks data available");
        return;
      }

      // Overlay remarks
      ctx.fillStyle = "blue";
      ctx.font = "14px Arial";
      remarks.forEach((remark) => {
        if (remark.hour !== undefined && remark.reason) {
          const x = remark.hour * (canvas.width / 24);
          ctx.fillText(remark.reason, x, canvas.height - 20);
        }
      });
    };
  }, [logs, remarks]);

  return <canvas ref={canvasRef} width={800} height={400} />;
};

export default LogSheetComponent;
