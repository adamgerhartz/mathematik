export function greatestNumColumn(strNum1: string, strNum2: string) {
  if (strNum1.length >= strNum2.length) {
    return strNum1.length;
  }
  return strNum2.length;
}
