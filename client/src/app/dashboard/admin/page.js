import AdminComp from '@/components/Dashboard/Admin/AdminComp';
import ErrorPage from '@/components/ErrorPage';
import { getAllConribs } from '@/data/getAllContribs';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  try {
    const contribsRes = await getAllConribs();

    if (!contribsRes.data) {
      throw new Error('Gagal memuat data dari server');
    }

    return (
      <AdminComp
        initialContribs={contribsRes.data}
        token={session.accessToken}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Admin');
  }
};

export default AdminPage;
