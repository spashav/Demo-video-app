import { useParams } from 'react-router-dom';
import { Player } from '../player/player';

const sources = [
  {
    //src: 'https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/master.m3u8',
    poster: 'https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/bbb.png',
    type: 'application/x-mpegURL',
  },
  {
    //src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    src: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/playlist.m3u8',
    poster: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/tears_of_steel.jpg',
    type: 'application/x-mpegURL',
  },
];

export function PlayerIframe() {
  const { id, version } = useParams();
  if (!id || !version) {
    return <div>Empty id or version in url</div>;
  }
  return (
    <Player
      options={{
        sources: [sources[parseInt(id, 10) % 2]],
      }}
    />
  );
}
