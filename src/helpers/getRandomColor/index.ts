function getRandomColor(): number {
  const colorValue: number = Math.floor(Math.random() * 16777215);
  return colorValue;
}

export default getRandomColor;
