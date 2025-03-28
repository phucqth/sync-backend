# D365 Data Synchronizer

## Overview

This project is designed to synchronize data from Dynamics 365 (D365) Business Central APIs. It fetches, posts, and updates data, ensuring your application always has the latest information from D365. A key feature of this project is its efficient management of OAuth 2.0 access tokens, leveraging Redis for secure and rapid token storage and retrieval.

## Key Features

*   **Data Synchronization:** Seamlessly fetches data from D365 Business Central APIs using `GET`, `POST`, and `PUT` requests.
*   **OAuth 2.0 Authentication:**  Implements the OAuth 2.0 client credentials grant flow to obtain access tokens from Microsoft Identity Platform.
*   **Token Management with Redis:**
    *   Stores and retrieves access tokens in a Redis cache for improved performance and efficiency.
    *   Minimizes the number of requests to the authorization server, reducing latency and potential rate-limiting issues.
    *   Automatically refreshes tokens before they expire.
*   **Environment Variable Configuration:** Uses environment variables for sensitive information like API credentials, client IDs, secrets, and Redis connection details.
*   **Error Handling:** Includes robust error handling to gracefully manage API request failures and token refresh issues.
* **Connection Status Check:** Has a method to check D365 connection.

## Technology Stack

*   **Node.js:** Runtime environment.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **Redis:** In-memory data structure store for token caching.
*   **dotenv:** To use environment variables.

## Project Structure


## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd sync-system/api-service
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    *   Create a `.env` file in the root directory of your `api-service` folder.
    *   Populate the `.env` file with the following required variables:

        ```
        APP_TENANT_ID=<your-d365-tenant-id>
        APP_CLIENT_ID=<your-app-client-id>
        APP_CLIENT_SECRET=<your-app-client-secret>
        APP_BASE_URL=<your-d365-base-url>
        D365_ENVIRONMENT=<your-d365-environment>
        D365_COMPANY_ID=<your-d365-company-id>
        REDIS_HOST=<your-redis-host>       # Optional if using Redis
        REDIS_PORT=<your-redis-port>       # Optional if using Redis
        REDIS_PASSWORD=<your-redis-password> # Optional if using Redis
        ```

    *   **Note:** The redis configuration is optional, but highly recommended.

4. **Start the Service:**
    ```bash
    npm start
    ```
    or
    ```bash
    node src/index.js
    ```

## Usage

The `api-service.js` file contains the core functionality for interacting with the D365 API. You can use these functions:

*   `getDataFromBC(url)`: Fetch data from a given Business Central URL using basic authentication.
*   `postDataToBC(url, data)`: Post data to a Business Central URL using basic authentication.
*   `putDataToBC(url, data)`: Update data in a Business Central URL using basic authentication.
*   `getConntectionStatus(url)`: Check D365 connection using basic authentication.
*   `getValueFromAPI({ apiType, reqId, reqBody })`: Interact with the D365 API that uses Oauth2 for authentication.

## Redis Integration (Token Management)

The project utilizes Redis to cache OAuth 2.0 access tokens. This reduces the need to request a new token for every API call.

### How it Works

1.  **Token Retrieval:** When `getValueFromAPI` is called, it first checks if a valid token exists in the Redis cache.
2.  **Token Refresh:** If the token is missing or expired, the system makes a request to the Microsoft Identity Platform to get a new access token.
3.  **Token Storage:** The newly acquired token is stored in Redis, along with its expiration time.
4.  **Token Reuse:** Subsequent requests will reuse the cached token until it expires.

### Benefits

*   **Performance:** Faster API calls because fewer requests are made to the authentication server.
*   **Efficiency:** Reduces the load on the authentication server.
*   **Scalability:** Helps prevent rate-limiting issues with the Microsoft Identity Platform.

## Contributing

Contributions are welcome! If you have suggestions or bug fixes, please create a pull request.

## License

[Your License Here (e.g., MIT License)]
