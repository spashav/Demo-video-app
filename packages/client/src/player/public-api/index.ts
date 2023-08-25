interface WindowWithPlayer {
  PLAYER: {
    iframe: {
      setSource: (props: { id: string; container: string }) => void;
    };
  };
}
export const getPlayerPublicApi = () => {
  const windowWithPublicApi = window as unknown as WindowWithPlayer;
  windowWithPublicApi.PLAYER = windowWithPublicApi.PLAYER || {};
  windowWithPublicApi.PLAYER.iframe = windowWithPublicApi.PLAYER.iframe || {};

  return windowWithPublicApi.PLAYER;
};
