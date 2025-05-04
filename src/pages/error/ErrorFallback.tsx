/**
 ***************************************************************************
 * @author junghwan.an
 * @version 0.1
 * @since 2023.08.02
 * @description:
 ***************************************************************************
 * */
interface FallbackProps {
  error: any;
  resetErrorBoundary: (...args: any[]) => void;
}
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps): React.ReactElement {
  return (
    <div>
      <h1>
        An error occurred:
        {error.message}
      </h1>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;
