export const isValidToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};