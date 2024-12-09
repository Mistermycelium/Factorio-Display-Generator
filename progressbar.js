export default function progressBar(value, item, color='#4287f5', font='technology-slot-level-font') {
  const max = 100;
  const progress = Math.min(Math.max(value, 0), max);
  const percent = Math.round((progress / max) * 100);

  // Create progress bar string
  const barLength = 20;
  let progressBar = '';
  let mod = percent % 5
  let filledLength = barLength * ((percent - mod)/100)

  // Map partial steps to fit 100 unique outputs within the 20 character constraint
  const partial = {
    1: '▎',
    2: '▌',
    3: '▋',
    4: '▊'
  }

  // Fill the progress bar with '#' characters
  for (let i = 0; i < filledLength; i++) {
      progressBar += '█';
  }

  // Use mod to add a partial if necessary
  if (mod!= 0) {
    progressBar += partial[mod]
  }

  while (progressBar.length < barLength) {
      progressBar += '░';
  }

  // Not sure why we need to check for nan here
  if (isNaN(percent)) { return }
  let head = ''
  let tail = ''
  if (font) {
    head += `[font=${font}]`
    tail = `[/font]${tail}`
  }
  tail = ` ${percent}%${tail}`
  
  if (color) {
    head += `[color=${color}]`
    tail = `[/color]${tail}`
  }
  head += `[item=${item}]`

  const progressBarString = `${head} ${progressBar} ${tail}`;
  return (progressBarString);
}

