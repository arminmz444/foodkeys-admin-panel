import _ from '@lodash';
import clsx from 'clsx';

export const orderStatuses = [
  {
    id: 1,
    name: 'در انتظار پرداخت چک',
    color: 'bg-blue text-white',
  },
  {
    id: 2,
    name: 'پرداخت مورد قبول واقع شد',
    color: 'bg-green text-white',
  },
  {
    id: 3,
    name: 'آماده سازی سفارش',
    color: 'bg-orange text-black',
  },
  {
    id: 4,
    name: 'ارسال شد',
    color: 'bg-purple text-white',
  },
  {
    id: 5,
    name: 'تحویل داده شد',
    color: 'bg-green-700 text-white',
  },
  {
    id: 6,
    name: 'لفو شد',
    color: 'bg-pink text-white',
  },
  {
    id: 7,
    name: 'بازپرداخت شد',
    color: 'bg-red text-white',
  },
  {
    id: 8,
    name: 'خطای پرداخت',
    color: 'bg-red-700 text-white',
  },
  {
    id: 9,
    name: 'در صورت پیش سفارش (پرداخت شده)',
    color: 'bg-purple-300 text-white',
  },
  {
    id: 10,
    name: 'در انتظار پرداخت بانکی',
    color: 'bg-blue text-white',
  },
  {
    id: 11,
    name: 'در انتظار پرداخت پی پال',
    color: 'bg-blue-700 text-white',
  },
  {
    id: 12,
    name: 'از راه دور پرداخت مورد قبول واقع شد',
    color: 'bg-green-800 text-white',
  },
  {
    id: 13,
    name: 'در صورت پیش سفارش (پرداخت نشده)',
    color: 'bg-purple-700 text-white',
  },
  {
    id: 14,
    name: 'در انتظار پرداخت نقدی در هنگام تحویل',
    color: 'bg-blue-800 text-white',
  },
];

function OrdersStatus(props) {
  return (
    <div
      className={clsx(
        'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
        _.find(orderStatuses, { name: props.name }).color
      )}
    >
      {props.name}
    </div>
  );
}

export default OrdersStatus;
