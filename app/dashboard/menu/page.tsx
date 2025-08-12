import { Suspense } from 'react'
import RestaurantPOS from './RestuarantPOS'

export default function page() {
  return (
    <Suspense>
      <RestaurantPOS />
    </Suspense>
  );
};
