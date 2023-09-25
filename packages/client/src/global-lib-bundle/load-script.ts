export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = url;
    script.defer = true;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}
