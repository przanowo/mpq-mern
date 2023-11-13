interface MessageProps {
  message: string;
  type?: 'error' | 'success' | 'info';
}

const Message: React.FC<MessageProps> = ({ message, type = 'info' }) => {
  const bgColor =
    type === 'error'
      ? 'bg-red-500'
      : type === 'success'
      ? 'bg-green-500'
      : 'bg-blue-500'; // Default is 'info'

  return (
    <div className={`${bgColor} text-white text-sm py-2 px-4 rounded-md`}>
      {message}
    </div>
  );
};

export default Message;
