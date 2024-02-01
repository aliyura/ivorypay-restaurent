const sockMerchant = (n, arr) => {
  const list = new Set();
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (list.has(arr[i])) {
      count++;
      list.delete(arr[i]);
    } else {
      list.add(arr[i]);
    }
  }
  return count;
};

const result = sockMerchant(9, [10, 20, 20, 10, 10, 30, 50, 10, 20]);
console.log('result:', result);
