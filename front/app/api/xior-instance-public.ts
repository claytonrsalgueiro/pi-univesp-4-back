import xior from 'xior';

function sanitizeBase(url?: string) {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const xiorInstancePublic = xior.create({
  baseURL: sanitizeBase(process.env.API_URL),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 30000,
});

// 🔒 Garante que NUNCA vamos enviar array acidentalmente e que objeto vira JSON
xiorInstancePublic.interceptors.request.use((config) => {
  const hdrs = config.headers || {};
  const ct =
    (hdrs['Content-Type'] as string) ??
    (hdrs['content-type'] as string) ??
    'application/json';

  const isJson = String(ct).toLowerCase().includes('application/json');

  if (
    isJson &&
    config.data != null &&
    typeof config.data !== 'string' &&
    !(config.data instanceof FormData)
  ) {
    config.data = JSON.stringify(config.data);
  }

  return config;
});

xiorInstancePublic.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject({
      error: error?.response?.data?.message || error?.message,
      status: error?.response?.status,
    });
  }
);

export default xiorInstancePublic;
