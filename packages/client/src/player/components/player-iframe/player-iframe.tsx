export function PlayerIframe({ id, version }: { id: string; version: string }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {`This is player iframe with version "${version}" and video "${id}" route.`}
    </div>
  );
}
