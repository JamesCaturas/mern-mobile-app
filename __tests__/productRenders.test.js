import { Provider } from 'react-redux';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import ProductListScreen from '../screens/ProductListScreen';
import { store } from '../store';
import { products } from '../data/products';

jest.mock('../services/products', () => ({
  fetchProducts: jest.fn(),
}));
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'trainee@shopfront.test' }, status: 'signedIn' }),
}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ name: 'Products', params: undefined }),
  useNavigation: () => ({ navigate: jest.fn(), dispatch: jest.fn() }),
}));

const { fetchProducts } = require('../services/products');

// The render log prints '[render] ProductCard <id>' on every card render, so counting those lines counts renders.
let cardRenders;
let logSpy;

beforeEach(() => {
  cardRenders = 0;
  logSpy = jest.spyOn(console, 'log').mockImplementation((tag, name) => {
    if (tag === '[render]' && name === 'ProductCard') cardRenders += 1;
  });
  fetchProducts.mockResolvedValue(products);
});

afterEach(() => logSpy.mockRestore());

async function mountScreen() {
  render(
    <Provider store={store}>
      <ProductListScreen navigation={{ navigate: jest.fn(), dispatch: jest.fn() }} />
    </Provider>
  );
  await waitFor(() => expect(screen.getByText('Canvas Tote Bag')).toBeTruthy());
}

test('adding to the cart does not re-render the cards', async () => {
  const user = userEvent.setup();
  await mountScreen();
  cardRenders = 0;

  await user.press(screen.getAllByRole('button', { name: /^Add .* to cart$/ })[0]);
  await waitFor(() => expect(screen.getByText(/added to cart/)).toBeTruthy());

  expect(cardRenders).toBe(0);
});

test('typing in search does not re-render cards that stay visible', async () => {
  const user = userEvent.setup();
  await mountScreen();
  cardRenders = 0;

  await user.type(screen.getByPlaceholderText('Search products'), 'a');

  expect(cardRenders).toBe(0);
});
