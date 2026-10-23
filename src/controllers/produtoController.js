import * as produtoService from '../produtoService.js';

export async function cadastrar(req, res, next) {
  try { res.status(201).json(await produtoService.cadastrar(req.body)); }
  catch (erro) { next(erro); }
}

export async function listar(req, res, next) {
  try { res.json(await produtoService.listar()); }
  catch (erro) { next(erro); }
}

export async function buscarPorId(req, res, next) {
  try { res.json(await produtoService.buscarPorId(Number(req.params.id))); }
  catch (erro) { next(erro); }
}

export async function atualizar(req, res, next) {
  try { res.json(await produtoService.atualizar(Number(req.params.id), req.body)); }
  catch (erro) { next(erro); }
}

export async function deletar(req, res, next) {
  try {
    await produtoService.deletar(Number(req.params.id));
    res.send('Produto deletado com sucesso');
  } catch (erro) { next(erro); }
}

export async function listarAbaixoDoLimite(req, res, next) {
  try { res.json(await produtoService.listarAbaixoDoLimite()); }
  catch (erro) { next(erro); }
}
