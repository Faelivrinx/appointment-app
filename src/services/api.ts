// API service for client registration and authentication

// Define API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

// Client registration interface
export interface RegisterClientRequest {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface ActivateClientRequest {
  email: string;
  verificationCode: string;
  password: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Register a new client
 * @param clientData Client registration data
 * @returns API response
 */
export async function registerClient(
  clientData: RegisterClientRequest,
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    // Handle response
    if (response.status === 201) {
      return { status: response.status };
    }

    // Handle error responses
    let errorMessage = "Registration failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (error) {
      console.log("Error parsing JSON response:", error); // Log parsing error
      // If no JSON response, use status text
      errorMessage = response.statusText || errorMessage;
    }

    return {
      status: response.status,
      error: errorMessage,
    };
  } catch (error) {
    // Network or other errors
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function activateClient(
  clientData: ActivateClientRequest,
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/clients/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    if (response.status == 200) {
      return { status: response.status };
    }

    // Handle error responses
    let errorMessage = "Activation failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (error) {
      console.log("Error parsing JSON response:", error); // Log parsing error
      // If no JSON response, use status text
      errorMessage = response.statusText || errorMessage;
    }

    return {
      status: response.status,
      error: errorMessage,
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
