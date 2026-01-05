export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'API request failed');
  }

  return res.json();
}

export const auth = {
  login: (username, password) => 
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () => 
    apiFetch('/api/auth/me', {
      method: 'GET',
    }),

  logout: () => 
    apiFetch('/api/auth/logout', {
      method: 'POST',
    }),
};

export const assets = {
  list: () =>
    apiFetch('/api/assets', {
      method: 'GET',
    }),
};
