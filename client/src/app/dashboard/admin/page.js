import AdminComp from '@/components/Admin/AdminComp';
import ErrorPage from '@/components/ErrorPage';
import { getAllConribs } from '@/data/getAllContribs';
import { getAllPosts } from '@/data/getAllPosts';
import { getAllUsers } from '@/data/getAllUsers';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  try {
    const [postsRes, contribsRes, usersRes] = await Promise.all([
      getAllPosts(),
      getAllConribs(),
      getAllUsers(session.accessToken),
    ]);

    if (!postsRes.data || !contribsRes.data || !usersRes.data) {
      throw new Error('Gagal memuat data dari server');
    }

    return (
      <AdminComp
        initialUsers={usersRes.data}
        initialPosts={postsRes.data}
        initialContribs={contribsRes.data}
        token={session.accessToken}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Admin');
  }
};

export default AdminPage;
