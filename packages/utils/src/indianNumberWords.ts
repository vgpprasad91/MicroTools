export function numberToIndianWords(n: number): string {
  if (!Number.isFinite(n)) return "Invalid";
  if (n === 0) return "zero";
  if (n < 0) return "minus " + numberToIndianWords(-n);

  const ones = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

  const toWordsBelow100 = (num: number) => {
    if (num < 20) return ones[num];
    const t = Math.floor(num / 10), r = num % 10;
    return tens[t] + (r ? " " + ones[r] : "");
  };
  const toWordsBelow1000 = (num: number) => {
    const h = Math.floor(num / 100), r = num % 100;
    return (h ? ones[h] + " hundred" + (r ? " and " : "") : "") + (r ? toWordsBelow100(r) : "");
  };

  let s = "";
  let rem = Math.floor(n);
  const crore = Math.floor(rem / 10000000); rem %= 10000000;
  const lakh = Math.floor(rem / 100000); rem %= 100000;
  const thousand = Math.floor(rem / 1000); rem %= 1000;
  const hundred = rem;

  if (crore) s += toWordsBelow100(crore) + " crore";
  if (lakh) s += (s ? " " : "") + toWordsBelow100(lakh) + " lakh";
  if (thousand) s += (s ? " " : "") + toWordsBelow100(thousand) + " thousand";
  if (hundred) s += (s ? " " : "") + toWordsBelow1000(hundred);

  return s.trim();
}

