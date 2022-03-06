/**
 * Credit for this function comes from "Mourner" on StackOverflow:
 * https://stackoverflow.com/questions/9553354/how-do-i-get-the-decimal-places-of-a-floating-point-number-in-javascript#:~:text=Edit%3A%20a%20more%20complete%20solution%20with%20edge%20cases%20covered%3A
 */
export function precision(a: number) {
  if (!isFinite(a)) return 0;
  let e = 1, p = 0;
  while (Math.round(a * e) / e !== a) { e *= 10; p++; }
  return p;
}
