export function addHowlListener(howl, event, callback) {
  howl.on(event, callback);
  return () => howl.off(event, callback);
}
