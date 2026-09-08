/**
 * A utility function to add a timeout to a promise
 * @param promise The promise to add a timeout to
 * @param ms The timeout duration in milliseconds
 * @returns A new promise that resolves or rejects with the original promise, or rejects with a timeout error if the timeout is reached
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms))
  ])
}
