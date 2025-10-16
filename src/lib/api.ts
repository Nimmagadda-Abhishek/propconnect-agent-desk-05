import { Agent, LoginRequest, LoginResponse, Property, PropertyDto, Inquiry, PropertyStats } from '@/types/agent';

const API_BASE_URL = 'https://9d236d0d8589.ngrok-free.app/api';

// API Helper function for handling errors
const handleApiError = async (response: Response) => {
  console.log('Full response object:', response);
  console.log('Response URL:', response.url);
  console.log('Response type:', response.type);
  
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    
    try {
      const errorData = await response.json();
      console.log('Error response data:', errorData);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (jsonError) {
      console.log('Failed to parse error as JSON:', jsonError);
      // If response is not JSON, try to get text
      try {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        errorMessage = errorText || response.statusText || errorMessage;
      } catch (textError) {
        console.log('Failed to parse error as text:', textError);
        errorMessage = response.statusText || errorMessage;
      }
    }
    
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('propconnect_agent');
      window.location.href = '/login';
    }
    
    throw new Error(errorMessage);
  }
  return response;
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Making login request to:', `${API_BASE_URL}/auth/agent/login`);
      console.log('Request payload:', credentials);
      
      const response = await fetch(`${API_BASE_URL}/auth/agent/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(credentials),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      await handleApiError(response);
      const result = await response.json();
      console.log('Login response:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  }
};

// Properties API
export const propertiesAPI = {
  getMyProperties: async (agentId: number): Promise<Property[]> => {
    try {
      console.log('Making properties request to:', `${API_BASE_URL}/agent/properties/my-properties/${agentId}`);
      
      const response = await fetch(`${API_BASE_URL}/agent/properties/my-properties/${agentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      console.log('Properties response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Properties response:', result);
      return result;
    } catch (error) {
      console.error('Properties error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch properties');
    }
  },
  
  getProperty: async (id: number): Promise<Property> => {
    try {
      console.log('Making single property request to:', `${API_BASE_URL}/agent/properties/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/agent/properties/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      console.log('Single property response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Single property response:', result);
      return result;
    } catch (error) {
      console.error('Single property error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch property details');
    }
  },
  
  createProperty: async (propertyData: PropertyDto, images: File[]): Promise<{ message: string; propertyId: number }> => {
    try {
      const formData = new FormData();
      
      // Add all PropertyDto fields to FormData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });
      
      // Add images
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      const response = await fetch(`${API_BASE_URL}/agent/properties`, {
        method: 'POST',
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create property');
    }
  },
  
  updateProperty: async (id: number, propertyData: PropertyDto, images?: File[], imagesToRemove?: number[]): Promise<{ message: string; propertyId: number }> => {
    try {
      const formData = new FormData();

      // Add all PropertyDto fields to FormData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      // Add images if provided
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('newImages', image);
        });
      }

      // Add images to remove if provided
      if (imagesToRemove && imagesToRemove.length > 0) {
        imagesToRemove.forEach((imageId) => {
          formData.append('imagesToRemove', imageId.toString());
        });
      }

      const response = await fetch(`${API_BASE_URL}/agent/properties/${id}`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData, // Don't set Content-Type header - browser will set it with boundary
      });

      await handleApiError(response);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update property');
    }
  }
};

// Stats API
export const statsAPI = {
  getPropertyStats: async (agentId: number): Promise<PropertyStats> => {
    try {
      console.log('Making stats request to:', `${API_BASE_URL}/agent/properties/stats/${agentId}`);
      
      const response = await fetch(`${API_BASE_URL}/agent/properties/stats/${agentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      console.log('Stats response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Stats response:', result);
      return result;
    } catch (error) {
      console.error('Stats error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch property statistics');
    }
  }
};

// Admin API for managing all properties
export const adminAPI = {
  getAllProperties: async (): Promise<Property[]> => {
    try {
      console.log('Making admin properties request to:', `${API_BASE_URL}/properties`);
      
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      console.log('Admin properties response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Admin properties response:', result);
      return result;
    } catch (error) {
      console.error('Admin properties error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch properties');
    }
  },

  getProperty: async (propertyId: number): Promise<Property> => {
    try {
      console.log('Making admin property request to:', `${API_BASE_URL}/properties/${propertyId}`);
      
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      console.log('Admin property response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Admin property response:', result);
      return result;
    } catch (error) {
      console.error('Admin property error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch property details');
    }
  },

  updateProperty: async (propertyId: number, propertyData: PropertyDto, images?: File[]): Promise<{ message: string; propertyId: number }> => {
    try {
      console.log('Making admin property update request to:', `${API_BASE_URL}/properties/${propertyId}`);
      
      const formData = new FormData();
      
      // Add all PropertyDto fields to FormData
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });
      
      // Add new images if provided
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('newImages', image);
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });
      
      console.log('Admin property update response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Admin property update response:', result);
      return result;
    } catch (error) {
      console.error('Admin property update error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update property');
    }
  },

  deleteProperty: async (propertyId: number): Promise<{ message: string }> => {
    try {
      console.log('Making admin property delete request to:', `${API_BASE_URL}/properties/${propertyId}`);
      
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      console.log('Admin property delete response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Admin property delete response:', result);
      return result;
    } catch (error) {
      console.error('Admin property delete error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete property');
    }
  }
};

// Inquiries API
export const inquiriesAPI = {
  getInquiries: async (agentId: number): Promise<Inquiry[]> => {
    try {
      console.log('Making inquiries request to:', `${API_BASE_URL}/inquiries/agent/${agentId}`);

      const response = await fetch(`${API_BASE_URL}/inquiries/agent/${agentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      console.log('Inquiries response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Inquiries response:', result);
      return result;
    } catch (error) {
      console.error('Inquiries error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch inquiries');
    }
  },

  getInquiry: async (id: number): Promise<Inquiry> => {
    try {
      console.log('Making single inquiry request to:', `${API_BASE_URL}/inquiries/${id}`);

      const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      console.log('Single inquiry response status:', response.status);
      await handleApiError(response);
      const result = await response.json();
      console.log('Single inquiry response:', result);
      return result;
    } catch (error) {
      console.error('Single inquiry error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch inquiry details');
    }
  }
};
