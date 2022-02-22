export function generateRandomNumber() {
  const rand: number = Math.floor((Math.random() * (13 - 1 + 1) + 1));
  let num = 0;
  switch (rand) {
    case 1:
      num = Number(Math.floor((Math.random() * (9999 - 1000 + 1) + 1000)));
      break;
    case 2:
      num = Number((Math.random() * (999 - 100 + 1) + 100).toFixed(1));
      break;
    case 3:
      num = Number(Math.floor((Math.random() * (999 - 100 + 1) + 100)));
      break;
    case 4:
      num = Number((Math.random() * (99 - 10 + 1) + 10).toFixed(1));
      break;
    case 5:
      num = Number((Math.random() * (99 - 10 + 1) + 10).toFixed(2));
      break;
    case 6:
      num = Number(Math.floor((Math.random() * (99 - 10 + 1) + 10)));
      break;
    case 7:
      num = Number((Math.random() * (9 - 1 + 1) + 1).toFixed(1));
      break;
    case 8:
      num = Number((Math.random() * (9 - 1 + 1) + 1).toFixed(2));
      break;
    case 9:
      num = Number((Math.random() * (9 - 1 + 1) + 1).toFixed(3));
      break;
    case 10:
      num = Number(Math.floor((Math.random() * (9 - 1 + 1) + 1)));
      break;
    case 11:
      num = Number((Math.random() * (0.999 - 0.001 + 1) + 0.001).toFixed(3));
      break;
    case 12:
      num = Number((Math.random() * (0.999 - 0.001 + 1) + 0.001).toFixed(2));
      break;
    case 13:
      num = Number((Math.random() * (0.999 - 0.001 + 1) + 0.001).toFixed(1));
      break;
  }

  return num;
}
