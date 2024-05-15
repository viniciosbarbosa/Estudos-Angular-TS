export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  imagemUrl?: string;
  preco: string;
  estoque: number;
}

export interface Produtos extends Array<Produto> {}
