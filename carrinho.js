export function adicionarAoCarrinho(
  carrinho,
  produto,
  quantidade = 1,
) {
  const quantidadeValida =
    Number.isFinite(Number(quantidade))
      ? Math.max(
          1,
          Math.floor(Number(quantidade)),
        )
      : 1

  const existente =
    carrinho.find(
      (item) =>
        item.produto.id === produto.id,
    )

  if (!existente) {
    return [
      ...carrinho,
      {
        produto,
        quantidade: quantidadeValida,
      },
    ]
  }

  return carrinho.map((item) =>
    item.produto.id === produto.id
      ? {
          ...item,
          quantidade:
            item.quantidade +
            quantidadeValida,
        }
      : item,
  )
}

export function alterarQuantidade(
  carrinho,
  produtoId,
  delta,
) {
  return carrinho
    .map((item) =>
      item.produto.id === produtoId
        ? {
            ...item,
            quantidade:
              item.quantidade + delta,
          }
        : item,
    )
    .filter(
      (item) =>
        item.quantidade > 0,
    )
}

export function removerDoCarrinho(
  carrinho,
  produtoId,
) {
  return carrinho.filter(
    (item) =>
      item.produto.id !== produtoId,
  )
}

export function calcularTotais(
  carrinho,
) {
  const quantidadeItens =
    carrinho.reduce(
      (total, item) =>
        total + item.quantidade,
      0,
    )

  const subtotal =
    carrinho.reduce(
      (total, item) =>
        total +
        item.produto.preco *
          item.quantidade,
      0,
    )

  return {
    quantidadeItens,
    subtotal,
    total: subtotal,
  }
}
