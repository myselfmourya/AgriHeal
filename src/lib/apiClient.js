/**
 * Singleton API Client with Exponential Backoff
 */
class ApiClient {
  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }
    
    // Default configuration
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    ApiClient.instance = this;
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  _calculateDelay(retryCount) {
    const delay = this.baseDelay * Math.pow(2, retryCount);
    // Add jitter (random 0-500ms) to prevent thundering herd problem
    const jitter = Math.floor(Math.random() * 500);
    return delay + jitter;
  }

  /**
   * Delay utility using Promises
   */
  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Internal fetch wrapper handling 429 retries
   */
  async _fetchWithBackoff(url, options = {}, retryCount = 0) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      });

      if (response.status === 429) {
        if (retryCount >= this.maxRetries) {
          throw new Error('Rate limit exceeded. Max retries reached.');
        }

        // Handle Retry-After header if present
        const retryAfter = response.headers.get('Retry-After');
        let delayMs;
        if (retryAfter) {
          // Retry-After can be seconds or HTTP date
          const parsed = parseInt(retryAfter, 10);
          if (Number.isNaN(parsed)) {
            delayMs = new Date(retryAfter).getTime() - Date.now();
          } else {
            delayMs = parsed * 1000;
          }
        } else {
          delayMs = this._calculateDelay(retryCount);
        }

        console.warn(`[ApiClient] 429 Too Many Requests on ${url}. Retrying in ${delayMs}ms (Attempt ${retryCount + 1}/${this.maxRetries}).`);
        await this._wait(Math.max(delayMs, 0));
        
        return this._fetchWithBackoff(url, options, retryCount + 1);
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown Error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();

    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        // Network error (offline). Let the service handle offline state or throw.
        throw new Error('Network Error: Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    return this._fetchWithBackoff(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(url, body, options = {}) {
    return this._fetchWithBackoff(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * PUT request
   */
  async put(url, body, options = {}) {
    return this._fetchWithBackoff(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this._fetchWithBackoff(url, { ...options, method: 'DELETE' });
  }
}

// Export the singleton instance
export const apiClient = new ApiClient();
