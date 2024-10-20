const idExtract = (email: string): string | null => {
  const regex = /h\d{1,2}s(\d{3})xxx@gw1\.kr/;
  const match = email.match(regex);

  if (match && match[1]) {
    const numbers = match[1];
    const firstDigit = parseInt(numbers.charAt(0), 10);
    const restDigits = numbers.slice(1);

    let result: string;

    if (firstDigit >= 1 && firstDigit <= 3) {
      result = `1${numbers}`;
    } else if (firstDigit >= 4 && firstDigit <= 6) {
      result = `2${firstDigit - 3}${restDigits}`;
    } else if (firstDigit >= 7 && firstDigit <= 9) {
      result = `3${firstDigit - 6}${restDigits}`;
    } else {
      return null;
    }

    return result;
  }

  return null;
};
