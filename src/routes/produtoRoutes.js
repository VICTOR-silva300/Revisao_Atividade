import { Router } from 'express';
import * as controller from '../controllers/produtoController.js';

const router = Router();

// IMPORTANTE: /baixo-estoque vem antes de /:id.
router.get('/baixo-estoque', controller.listarAbaixoDoLimite);
router.post('/', controller.cadastrar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;
