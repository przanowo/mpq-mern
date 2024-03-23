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
    <div className='lg:mt-24 p-6 mb-16'>
      <h1 className='text-2xl font-bold mb-4'>Users</h1>
      {loadingDelete && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message type='error' message='Failed to loading users' />
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded-lg'>
            <thead className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
              <tr>
                <th className='py-3 px-6 text-left'>ID</th>
                <th className='py-3 px-6 text-left'>NAME</th>
                <th className='py-3 px-6 text-left'>EMAIL</th>
                <th className='py-3 px-6 text-left'>ADMIN</th>
                <th className='py-3 px-6 text-left'>ACTIONS</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 text-sm'>
              {users?.map((user: any) => (
                <tr
                  key={user._id}
                  className='border-b border-gray-200 hover:bg-gray-100'
                >
                  <td className='py-3 px-6 text-left whitespace-nowrap'>
                    {user._id}
                  </td>
                  <td className='py-3 px-6 text-left'>{user.name}</td>
                  <td className='py-3 px-6 text-left'>
                    <a
                      href={`mailto:${user.email}`}
                      className='text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out'
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className='py-3 px-6 text-center'>
                    {user.isAdmin ? (
                      <span className='bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs'>
                        Yes
                      </span>
                    ) : (
                      <span className='bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs'>
                        No
                      </span>
                    )}
                  </td>
                  <td className='py-3 px-6 text-center'>
                    <Link to={`/admin/user/${user._id}/edit`}>
                      <button className='text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out'>
                        Edit
                      </button>
                    </Link>
                    <button
                      className='text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2 transition duration-300 ease-in-out'
                      onClick={() => deleteHandler(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserListScreen
