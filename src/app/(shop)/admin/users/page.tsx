export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table

import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';
import { UserTable } from './ui/UserTable';

export default async  function OrdersPage() {

  const {ok, users=[]} = await getPaginatedUsers(); // si no viene nada , por defecto es arreglo vacio

  if(!ok){
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UserTable users={users}/>
        <Pagination totalPages={1}/>
      </div>
    </>
  );
}