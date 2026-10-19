import { sizedImageUrl } from '../utils/imageUrl';

const URL = 'https://picsum.photos/seed/tote/600/400';

test('asks for a smaller picture when the card is narrow', () => {
  // 150 points wide on a 2x screen = 300 pixels
  expect(sizedImageUrl(URL, 150)).toBe('https://picsum.photos/seed/tote/300/200');
});

test('never asks for more pixels than the original has', () => {
  expect(sizedImageUrl(URL, 500)).toBe(URL);
});

test('leaves URLs it does not understand alone', () => {
  expect(sizedImageUrl('https://example.com/a.jpg', 150)).toBe('https://example.com/a.jpg');
});
