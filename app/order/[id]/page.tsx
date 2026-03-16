import { ALL_ORDERS } from '@/lib/data';
import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return ALL_ORDERS.map((order) => ({ id: order.id }));
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailClient params={params} />;
}
