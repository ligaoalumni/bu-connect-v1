"use client";

import { QRCodeCanvas } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  ButtonProps,
} from "@/components";
import { QRCodeValues } from "@/types";
import { useRef, useState } from "react";

interface QRCodeViewerProps {
  data: QRCodeValues;
  buttonLabel: string;
  buttonProps?: ButtonProps;
}

export function QRCodeViewer({
  data,
  buttonLabel,
  buttonProps,
}: QRCodeViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!data) return;

    setLoading(true);
    // Create an off-screen canvas
    const offCanvas = document.createElement("canvas");
    const size = 350; // Adjust the overall canvas size (including padding)
    const padding = 25; // Customize padding size
    offCanvas.width = size;
    offCanvas.height = size;
    const ctx = offCanvas.getContext("2d");

    if (ctx) {
      // Draw background
      ctx.fillStyle = "#ffffff"; // Background color
      ctx.fillRect(0, 0, size, size);

      // Draw the QR code onto the canvas
      const qrCanvas = canvasRef.current;
      if (qrCanvas) {
        const qrSize = size - 2 * padding; // QR code size
        ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);
      }

      // Download the customized image
      const url = offCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr_code.png";
      link.click();
      setLoading(false);
    }
  };

  if (!data) return null;

  const qrValue = `${process.env.NEXT_PUBLIC_CLIENT_URL}/qr-details/${data.id}`;

  return (
    <Dialog modal open={showModal}>
      <DialogTrigger asChild onClick={() => setShowModal(true)}>
        <Button {...buttonProps}>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code Viewer</DialogTitle>
          <DialogDescription>
            Scan the QR code to view and share alumni information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <QRCodeCanvas
            value={qrValue}
            size={275} // The size of the QR code itself
            className="mx-auto p-5 bg-white"
            ref={canvasRef}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          <Button type="button" disabled={loading} onClick={handleDownload}>
            {loading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
