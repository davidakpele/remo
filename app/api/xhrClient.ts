const xhrClient = <T = any>(
  api_url: string,
  method: string,
  headers: Record<string, string> = {},
  body: any = null
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, api_url);

    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // 1. SUCCESS: Server responded with 2xx
        if (xhr.status >= 200 && xhr.status < 300) {
          if (!xhr.responseText || xhr.responseText.trim() === '') {
            resolve({} as T);
            return;
          }
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response as T);
          } catch (error) {
            resolve(xhr.responseText as unknown as T);
          }
        } 
        // 2. SERVER ERROR OR VALIDATION: Server responded with 4xx or 5xx
        else if (xhr.status > 0) {
          let errorMessage = "An error occurred";
          
          if (xhr.status >= 500) {
            errorMessage = "Server is currently undergoing maintenance. Please try again later.";
          } else {
            // Likely 4xx errors (Invalid credentials, bad request)
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage = errorResponse.message || errorResponse.error || `Error: ${xhr.status}`;
            } catch (e) {
              errorMessage = xhr.responseText || `Error: ${xhr.status}`;
            }
          }
          reject(errorMessage);
        }
      }
    };

    // 3. NETWORK ERROR: User is offline or DNS failed (Status is 0)
    xhr.onerror = () => {
      reject('Connection failed. Please check your internet connection.');
    };

    // 4. TIMEOUT: Server took too long to respond
    xhr.timeout = 10000;
    xhr.ontimeout = () => {
      reject('The server is taking too long to respond. It might be down.');
    };

    xhr.send(body ? JSON.stringify(body) : null);
  });
};

export default xhrClient;