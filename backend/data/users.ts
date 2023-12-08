import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Boss Gyongyi',
    email: 'miniparfumqueen@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },

];

export default users;