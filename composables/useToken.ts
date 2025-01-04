export function useToken() {
  const isTokenPassed = useState('is-token-passed', () => false);

  return {
    isTokenPassed,
  };
}
