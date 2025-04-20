import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import '../styles/index.css';

const Perfil = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    senha: '',
    confirmacaoSenha: ''
  });

  useEffect(() => {
    // Simulação de carregamento de dados do usuário
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setFormData({
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '(11) 98765-4321',
        endereco: {
          rua: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Jardim Primavera',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        senha: '',
        confirmacaoSenha: ''
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.senha !== formData.confirmacaoSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess(false);
    
    // Simulação de atualização de perfil
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      
      // Limpar campos de senha após salvar
      setFormData({
        ...formData,
        senha: '',
        confirmacaoSenha: ''
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <div className="container my-5">
        <h1 className="mb-4">Meu Perfil</h1>
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            Perfil atualizado com sucesso!
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit} className="form-perfil">
              <h4 className="mb-3">Informações Pessoais</h4>
              <Form.Group className="mb-3">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <h4 className="mb-3 mt-4">Endereço</h4>
              <div className="row">
                <div className="col-md-8">
                  <Form.Group className="mb-3">
                    <Form.Label>Rua</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco.rua"
                      value={formData.endereco.rua}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco.numero"
                      value={formData.endereco.numero}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Complemento</Form.Label>
                <Form.Control
                  type="text"
                  name="endereco.complemento"
                  value={formData.endereco.complemento}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Bairro</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco.bairro"
                      value={formData.endereco.bairro}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco.cep"
                      value={formData.endereco.cep}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-8">
                  <Form.Group className="mb-3">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco.cidade"
                      value={formData.endereco.cidade}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      as="select"
                      name="endereco.estado"
                      value={formData.endereco.estado}
                      onChange={handleChange}
                    >
                      <option value="">Selecione...</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </div>
              
              <h4 className="mb-3 mt-4">Alterar Senha</h4>
              <p className="text-muted">Deixe em branco para manter a senha atual</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Nova Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Nova Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmacaoSenha"
                  value={formData.confirmacaoSenha}
                  onChange={handleChange}
                />
              </Form.Group>
              
              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
