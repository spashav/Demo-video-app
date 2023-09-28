import { saveAs } from 'file-saver';
const canvas = document.createElement('canvas');

export const captureFirstFrames = ({
  video,
  fileName,
  format = 'webp',
  quality = 0.92,
}: {
  video: HTMLVideoElement;
  fileName: string;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
}) => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  context.drawImage(video, 0, 0);
  canvas.toBlob(
    function (blob) {
      blob && saveAs(blob, `${fileName}.${format}`);
    },
    `image/${format}`,
    quality
  );
};
