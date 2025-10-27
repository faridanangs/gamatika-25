import AdminComp from '@/components/Dashboard/Admin/AdminComp';
import ErrorPage from '@/components/ErrorPage';
import { getAllConribs } from '@/data/getAllContribs';
import { getAllArtikel } from '@/data/getArtikelData';
import { getAllPosts } from '@/data/getPostsData';
import { getAllUsers } from '@/data/getUserData';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  try {
    const [postsRes, contribsRes, usersRes, artikelsRes] = await Promise.all([
      getAllPosts(),
      getAllConribs(),
      getAllUsers(session.accessToken),
      getAllArtikel(),
    ]);

    if (
      !postsRes.data ||
      !contribsRes.data ||
      !usersRes.data ||
      !artikelsRes.data
    ) {
      throw new Error('Gagal memuat data dari server');
    }

    return (
      <AdminComp
        initialUsers={usersRes.data}
        initialPosts={postsRes.data}
        initialContribs={contribsRes.data}
        token={session.accessToken}
        initialArtikels={artikelsRes.data}
      />
    );
  } catch (error) {
    return ErrorPage(error, 'Admin');
  }
};

export default AdminPage;
