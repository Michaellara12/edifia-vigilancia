export function getRandomImageUrl() {
  const randomInt = Math.floor(Math.random() * 5) + 1; // Generates a random number between 1 and 5 (inclusive)
  const imageUrl = `/assets/illustrations/avatars/avatar_${randomInt}.png`;
  return imageUrl;
}

