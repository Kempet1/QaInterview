async function api(url, options = {}) {
  const config = { ...options };
  const isFormData = typeof FormData !== 'undefined' && config.body instanceof FormData;
  config.headers = { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) };
  if (config.body && typeof config.body !== 'string' && !isFormData) config.body = JSON.stringify(config.body);
  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') window.location.href = '/';
    throw new Error(data.error || 'Sesi login sudah berakhir');
  }
  if (!response.ok) throw new Error(data.error || 'Request gagal');
  return data;
}

async function loadCurrentUser() {
  const data = await api('/api/auth/me');
  const target = document.getElementById('user-name');
  if (target) target.textContent = `${data.user.username} / ${data.user.role}`;
  return data.user;
}

document.addEventListener('DOMContentLoaded', () => {
  const logout = document.getElementById('logout');
  if (logout) logout.addEventListener('click', async () => {
    await api('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  });
});
