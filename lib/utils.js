function swapArr(arr, dragIndex, hoverIndex) {
  arr[dragIndex] = arr.splice(hoverIndex, 1, arr[dragIndex])[0];
  return arr;
}
export {
  swapArr
}
