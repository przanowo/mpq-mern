import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const { data: users, refetch, error, isLoading } = useGetUsersQuery({});
  const [deleteUser, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteUserMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(id);
        console.log(result);

        // Successful deletion
        if ('data' in result && result.data) {
          toast.success('User deleted successfully');
          refetch();
        }
        // Error in deletion
        else if ('error' in result) {
          toast.error('Error deleting user');
          console.log(error);
        }
      } catch (error: any) {
        toast.error('Error deleting user catch');
        console.log('error in deletion catch');
      }
      console.log('delete', id);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {loadingDelete && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message type='error' message='Failed to loading users' />
      ) : (
        <table className='table table-striped table-bordered table-hover table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Link to={`/admin/user/${user._id}/edit`}>
                    <button className='btn btn-sm btn-light'>Edit</button>
                  </Link>
                  <button
                    className='btn btn-sm btn-danger'
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
  );
};

export default UserListScreen;
