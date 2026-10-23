import prisma from './lib/prisma.js';

function validarProduto(dto) {
  const { nome, quantidade, limiteMinimo } = dto;

  if (!nome || typeof nome !== 'string') {
    throw new Error('Nome do produto é obrigatório');
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    throw new Error('Quantidade deve ser um número inteiro maior ou igual a zero');
  }

  if (!Number.isInteger(limiteMinimo) || limiteMinimo < 0) {
    throw new Error('Limite mínimo deve ser um número inteiro maior ou igual a zero');
  }
}

export async function cadastrar(dto) {
  validarProduto(dto);
  return prisma.produto.create({ data: dto });
}

export async function listar() {
  return prisma.produto.findMany({ orderBy: { id: 'asc' } });
}

export async function buscarPorId(id) {
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

export async function atualizar(id, dto) {
  validarProduto(dto);
  await buscarPorId(id);
  return prisma.produto.update({ where: { id }, data: dto });
}

export async function deletar(id) {
  await buscarPorId(id);
  await prisma.produto.delete({ where: { id } });
}

export async function listarAbaixoDoLimite() {
  // A comparação coluna x coluna não é expressa diretamente por findMany;
  // usamos SQL parametrizado pelo Prisma para manter a regra do projeto original.
  return prisma.$queryRaw`
    SELECT id, nome, quantidade, limite_minimo AS limiteMinimo
    FROM produto
    WHERE quantidade <= limite_minimo
    ORDER BY id
  `;
}
