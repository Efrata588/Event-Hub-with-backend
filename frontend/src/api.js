const BASE_URL = "http://localhost:5000/api";

const fetchClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const config = {
    ...options,
    headers,
  };

  let url = `${BASE_URL}${endpoint}`;
  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    url += `?${query}`;
    delete config.params;
  }

  try {
    // console.log('API Request:', url, config); // DEBUG LOG
    const response = await fetch(url, config);

    // Check for 401/403 (optional: redirect to login)
    if (response.status === 401) {
      // console.log("Unauthorized");
    }

    const data = await response.json().catch(() => ({})); // Handle empty/non-json responses

    if (!response.ok) {
      // Throw error object similar to axios response error
      const error = new Error(data.message || response.statusText);
      error.response = { data, status: response.status };
      throw error;
    }

    return { data }; // Axios returns data in 'data' property
  } catch (error) {
    if (error.response) throw error; // Re-throw if it's already formatted
    error.response = { data: { message: error.message }, status: 500 }; // Network errors
    throw error;
  }
};

const api = {
  get: (url, config = {}) => fetchClient(url, { ...config, method: "GET" }),
  post: (url, data, config = {}) =>
    fetchClient(url, {
      ...config,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  put: (url, data, config = {}) =>
    fetchClient(url, {
      ...config,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  delete: (url, config = {}) =>
    fetchClient(url, { ...config, method: "DELETE" }),
};

export default api;
