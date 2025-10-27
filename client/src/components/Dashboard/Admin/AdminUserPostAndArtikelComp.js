import { FileText, Search, Trash2, Users } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';

export const UserPostAndArtikelComp = ({
  setSearchTerm,
  searchTerm,
  searchArtikelTerm,
  searchPostTerm,

  currentUsers,
  handleDeleteArtikel,
  handleDeletePost,
  handleDeleteUser,
  goToNextArtikelPage,
  goToNextPage,
  goToNextUserPage,
  goToPrevArtikelPage,
  goToPrevPage,
  goToPrevUserPage,
  currentArtikelPage,
  currentArtikels,
  currentPage,
  currentPosts,
  currentUserPage,
  setCurrentArtikelPage,
  setCurrentPage,
  setCurrentUserPage,
  setSearchArtikelTerm,
  setSearchPostTerm,

  totalArtikelsPages,
  totalPostsPages,
  totalUsersPages,
}) => {
  // Urutkan data berdasarkan created_at (terbaru dulu)
  const sortedUsers = [...currentUsers].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const sortedPosts = [...currentPosts].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const sortedArtikels = [...currentArtikels].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="space-y-8">
      {/* User Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Users className="text-blue-500 mr-2" /> Kelola User
        </h2>

        <div className="mb-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari user..."
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Postingan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Artikel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.full_name} />
                        <AvatarFallback>
                          {(user.full_name || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(user.created_at).toLocaleDateString(
                            'id-ID'
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.posts?.length || 0} postingan
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.artikels?.length || 0} artikel
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <Trash2 className="mr-1" size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Pagination */}
        {totalUsersPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevUserPage}
              disabled={currentUserPage === 1}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>

            <div className="flex space-x-1">
              {Array.from(
                { length: Math.min(5, totalUsersPages) }, // Tampilkan lebih banyak halaman
                (_, i) => {
                  let page;
                  if (totalUsersPages <= 5) {
                    page = i + 1;
                  } else if (currentUserPage <= 3) {
                    page = i + 1;
                  } else if (currentUserPage >= totalUsersPages - 2) {
                    page = totalUsersPages - 4 + i;
                  } else {
                    page = currentUserPage - 2 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentUserPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentUserPage(page)}
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextUserPage}
              disabled={currentUserPage === totalUsersPages}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Post Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="text-green-500 mr-2" /> Kelola Postingan
        </h2>

        <div className="mb-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari postingan..."
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchPostTerm}
              onChange={(e) => setSearchPostTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {post.author.username}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <Trash2 className="mr-1" size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Post Pagination */}
        {totalPostsPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPostsPages) }, (_, i) => {
                let page;
                if (totalPostsPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPostsPages - 2) {
                  page = totalPostsPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPostsPages}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Artikel Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="text-orange-500 mr-2" /> Kelola Artikel
        </h2>

        <div className="mb-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchArtikelTerm}
              onChange={(e) => setSearchArtikelTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedArtikels.map((artikel) => (
                <tr key={artikel.id}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {artikel.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(artikel.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {artikel.author?.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteArtikel(artikel.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <Trash2 className="mr-1" size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Artikel Pagination */}
        {totalArtikelsPages > 1 && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevArtikelPage}
              disabled={currentArtikelPage === 1}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>

            <div className="flex space-x-1">
              {Array.from(
                { length: Math.min(5, totalArtikelsPages) },
                (_, i) => {
                  let page;
                  if (totalArtikelsPages <= 5) {
                    page = i + 1;
                  } else if (currentArtikelPage <= 3) {
                    page = i + 1;
                  } else if (currentArtikelPage >= totalArtikelsPages - 2) {
                    page = totalArtikelsPages - 4 + i;
                  } else {
                    page = currentArtikelPage - 2 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={
                        currentArtikelPage === page ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setCurrentArtikelPage(page)}
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextArtikelPage}
              disabled={currentArtikelPage === totalArtikelsPages}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
