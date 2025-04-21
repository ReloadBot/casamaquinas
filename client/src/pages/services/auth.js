import api from './api';

export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    return {
      success: true,
      token: response.data.token,
      usuario: response.data.usuario
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      success: false,
      message: error.response?.data?.msg || 'Erro ao fazer login'
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return {
      success: true,
      token: response.data.token,
      usuario: response.data.usuario
    };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return {
      success: false,
      message: error.response?.data?.msg || 'Erro ao cadastrar usuário'
    };
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return {
      success: false,
      message: 'Erro ao fazer logout'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/usuario');
    return {
      success: true,
      usuario: response.data
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return {
      success: false,
      message: 'Erro ao buscar informações do usuário'
    };
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.put('/auth/usuario', userData);
    return {
      success: true,
      usuario: response.data
    };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return {
      success: false,
      message: error.response?.data?.msg || 'Erro ao atualizar usuário'
    };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    await api.put('/auth/alterar-senha', { senhaAtual: currentPassword, novaSenha: newPassword });
    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return {
      success: false,
      message: error.response?.data?.msg || 'Erro ao alterar senha'
    };
  }
};

export const requestPasswordReset = async (email) => {
  try {
    await api.post('/auth/recuperar-senha', { email });
    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    return {
      success: false,
      message: error.response?.data?.msg || 'Erro ao solicitar recuperação de senha'
    };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    await api.post('/auth/redefinir-senha', { token, novaSenha: newPassword });
    return { success: true };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return {
      success: false,
      message: error.response?.data?.msg || 'Erro ao redefinir senha'
    };
  }
};