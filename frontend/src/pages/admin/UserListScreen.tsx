import { FaCheck, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice'
import { toast } from 'react-toastify'

const UserListScreen = () => {
  const dispatch = useDispatch()
  const { data: users, refetch, error, isLoading } = useGetUsersQuery({})
  const [deleteUser, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteUserMutation()

  console.log(users, 'users')

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(id)
        console.log(result)

        // Successful deletion
        if ('data' in result && result.data) {
          toast.success('User deleted successfully')
          refetch()
        }
        // Error in deletion
        else if ('error' in result) {
          toast.error('Error deleting user')
          console.log(error)
        }
      } catch (error: any) {
        toast.error('Error deleting user catch')
        console.log('error in deletion catch')
      }
      console.log('delete', id)
    }
  }

  return (
    <div className='mt-24'>
      <h1 className='text-2xl font-bold mb-4'>Users</h1>
      {loadingDelete && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message type='error' message='Failed to loading users' />
      ) : (
        <table className='min-w-full bg-white shadow-md rounded-lg'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='py-2 px-4 text-left'>ID</th>
              <th className='py-2 px-4 text-left'>NAME</th>
              <th className='py-2 px-4 text-left'>EMAIL</th>
              <th className='py-2 px-4 text-left'>ADMIN</th>
              <th className='py-2 px-4 text-left'>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user._id} className='border-b'>
                <td className='py-2 px-4'>{user._id}</td>
                <td className='py-2 px-4'>{user.name}</td>
                <td className='py-2 px-4'>
                  <a
                    href={`mailto:${user.email}`}
                    className='text-blue-500 hover:text-blue-600'
                  >
                    {user.email}
                  </a>
                </td>
                <td className='py-2 px-4'>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td className='py-2 px-4'>
                  <Link to={`/admin/user/${user._id}/edit`}>
                    <button className='text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline'>
                      Edit
                    </button>
                  </Link>
                  <button
                    className='text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2'
                    onClick={() => deleteHandler(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserListScreen
