import { useWunderGraph } from '../generated/hooks';

export default function AuthenticateButton() {
  // Put Header or Footer Here

  const {
    user,
    client: { login, logout },
  } = useWunderGraph();

  if (user == null) {
    return (
      <a
        onClick={() => login.github()}
        href='#'
        className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8'
      >
        Log In
      </a>
    );
  }

  return (
    <a
      onClick={() => logout()}
      href='#'
      className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8'
    >
      Log Out
    </a>
  );
}
