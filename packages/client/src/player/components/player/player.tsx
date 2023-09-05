import { useEffect, useRef, FC } from 'react';
import videojs from 'video.js';
import type PlayerApi from 'video.js/dist/types/player';

import '../../../../../../node_modules/video.js/dist/video-js.css';

interface InitOptions {
  autoplay?: boolean;
  sources: {
    src: string;
    type: string;
    poster: string;
  }[];
}

export const Player: FC<{
  options: InitOptions;
  onReady?: (player: PlayerApi) => void;
}> = (props) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerApi | null>(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');
      videoElement.style.height = '100%'
      videoElement.style.width = '100%'

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        controls: true,
        ...options
      }, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      }));
      player.poster(options.sources[0].poster)

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div style={{width: '100%', height: '100%'}} ref={videoRef} />
  );
};
