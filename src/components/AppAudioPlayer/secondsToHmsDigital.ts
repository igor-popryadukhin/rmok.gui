export default function secondsToHmsDigital (seconds: number): string {
  const h: number = Math.floor(seconds / 3600);
  const m: number = Math.floor(seconds % 3600 / 60);
  const s: number = Math.floor(seconds % 3600 % 60);

  return String(h).padStart(2, '00') + ':' + String(m).padStart(2, '00') + ':' + String(s).padStart(2, '00');
}
