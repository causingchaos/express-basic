//generate a super secret key with our JWT token for signing purposes

const key = [...Array(30)]
  .map((n) => ((Math.random() * 36) | 0).toString(36) )
  .join('');

// 30 characters long, base 36 encoded (i.e a-z1-9)
console.log(key);