export const handler = async (event) => {
  console.log('API Proxy function triggered');
  console.log('Path:', event.path);
  console.log('Method:', event.httpMethod);

  // Get the backend URL from environment
  const backendUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;

  if (!backendUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Backend URL not configured' }),
    };
  }

  try {
    // Extract the API path
    const apiPath = event.path.replace('/.netlify/functions/api', '');
    const url = `${backendUrl}${apiPath}`;

    console.log('Proxying to:', url);

    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...event.headers,
      },
      body: event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
