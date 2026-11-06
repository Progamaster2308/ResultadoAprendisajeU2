const API_URL = import.meta.env.VITE_BASE_API_URL || '';

export async function loginApi(formData: any) {
  try {
    const url = `${API_URL}/api/v1/auth/token/`;
    console.log('url', url);
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error('Usuario o contraseña incorrecta');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
}

export async function registerApi(formData: any) {
  try {
    const url = `${API_URL}/api/v1/auth/register/`;
    console.log('url', url);
    const params = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };
    const response = await fetch(url, params);
    console.log(response);
    if (response.status !== 201) {
      const errorData = await response.json().catch(() => ({}));
      const msg =
        errorData.email?.[0] ||
        errorData.username?.[0] ||
        errorData.password?.[0] ||
        errorData.message ||
        'No se puede crear el usuario';
      throw new Error(msg);
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Error al registrar usuario');
  }
}

export async function getMeApi(token: string) {
  try {
    const url = `${API_URL}/api/v1/auth/me/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error('No autorizado o sesión vencida');
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function getSoapCountryApi(countryCode: string = 'MX') {
  try {
    const url = `${API_URL}/api/v1/soap/countries/?code=${encodeURIComponent(countryCode)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al consultar el servicio SOAP');
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
}
