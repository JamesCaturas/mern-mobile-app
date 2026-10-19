// "14.5995, 120.9842" - a coordinate pair, rounded to about 10 metres.
export function formatCoords({ latitude, longitude }) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

// "Oct 2, 3:42 PM" - used to say how old saved data is.
export function formatUpdated(iso) {
  if (!iso) return 'earlier';
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatPrice(value) {
  return `₱${value.toFixed(2)}`;
}