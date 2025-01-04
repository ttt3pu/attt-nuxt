export function useToken() {
  const passedToken = useState('passed-token', () => '');

  return {
    passedToken,
  };
}
