// src/components/PedidoFormModal.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';

export default function PedidoFormModal({ visible, onClose, onCreate }) {
  const { perfil } = useAuth();
  const isInquilino = perfil?.role === 'inquilino';

  // Campos do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [validade, setValidade] = useState('');

  // Calcula data padrão de hoje + 30 dias
  useEffect(() => {
    if (!visible) return;

    if (isInquilino) {
      const hoje = new Date();
      hoje.setDate(hoje.getDate() + 30);
      // Formato YYYY-MM-DD
      const dd = String(hoje.getDate()).padStart(2, '0');
      const mm = String(hoje.getMonth() + 1).padStart(2, '0');
      const yyyy = hoje.getFullYear();
      setValidade(`${yyyy}-${mm}-${dd}`);
    } else {
      // admin/senhorio pode inserir outra data – deixamos em branco para preencher
      setValidade('');
    }
    setTitulo('');
    setDescricao('');
  }, [visible, isInquilino]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // O onCreate espera um objeto { titulo, descricao, validade_orcamentos }
    onCreate({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      validade_orcamentos: validade,
    });
  };

  return (
    <Modal show={visible} onHide={onClose} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Novo Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Título */}
          <Form.Group className="mb-3" controlId="formTitulo">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o título do pedido"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </Form.Group>

          {/* Descrição */}
          <Form.Group className="mb-3" controlId="formDescricao">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descreva o pedido"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </Form.Group>

          {/* Validade – se for inquilino, campo desativado */}
          <Form.Group className="mb-3" controlId="formValidade">
            <Form.Label>Validade de Orçamentos</Form.Label>
            <Form.Control
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              required
              disabled={isInquilino}
            />
            {isInquilino && (
              <Form.Text className="text-muted">
                Como inquilino, a validade será 30 dias a partir de hoje.
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Criar Pedido
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
