import prisma from './lib/prisma.js';

export async function movimentar(dto) {
  const produtoId = Number(dto.produtoId);
  const tipo = String(dto.tipo ?? '').toUpperCase();
  const quantidade = Number(dto.quantidade);

  if (!Number.isInteger(produtoId) || produtoId <= 0) {
    const erro = new Error('produtoId inválido'); erro.status = 400; throw erro;
  }
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    const erro = new Error('Quantidade deve ser um número inteiro maior que zero'); erro.status = 400; throw erro;
  }
  if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
    const erro = new Error('Tipo de movimentação inválido. Use ENTRADA ou SAIDA'); erro.status = 400; throw erro;
  }

  return prisma.$transaction(async (tx) => {
    const produto = await tx.produto.findUnique({ where: { id: produtoId } });
    if (!produto) {
      const erro = new Error('Produto não encontrado'); erro.status = 404; throw erro;
    }

    if (tipo === 'ENTRADA') {
      await tx.produto.update({
        where: { id: produtoId },
        data: { quantidade: { increment: quantidade } }
      });
    } else {
      // A condição impede que duas saídas simultâneas deixem o estoque negativo.
      const resultado = await tx.produto.updateMany({
        where: { id: produtoId, quantidade: { gte: quantidade } },
        data: { quantidade: { decrement: quantidade } }
      });
      if (resultado.count === 0) {
        const erro = new Error('Estoque insuficiente'); erro.status = 409; throw erro;
      }
    }

    return tx.movimentacao.create({
      data: { tipo, quantidade, produtoId },
      include: { produto: true }
    });
  });
}

export async function listar() {
  return prisma.movimentacao.findMany({
    include: { produto: true },
    orderBy: { dataMovimentacao: 'desc' }
  });
}

export async function listarPorProduto(produtoId) {
  return prisma.movimentacao.findMany({
    where: { produtoId },
    include: { produto: true },
    orderBy: { dataMovimentacao: 'desc' }
  });
}
