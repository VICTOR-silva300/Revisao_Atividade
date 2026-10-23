export function errorHandler(erro, req, res, next) {
  console.error(erro);

  let status = Number.isInteger(erro.status) ? erro.status : 400;
  let mensagem = erro.message || 'Erro interno';

  if (erro.code === 'P2025') {
    status = 404;
    mensagem = 'Registro não encontrado';
  } else if (erro.code === 'P2003' || erro.code === 'P2014') {
    status = 409;
    mensagem = 'Não é possível concluir a operação porque existem registros relacionados';
  } else if (erro.code === 'P2002') {
    status = 409;
    mensagem = 'Já existe um registro com esses dados';
  }

  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    erro: mensagem
  });
}
