export default interface IBaseService<M, F, MI, R> {
  find(params: F): Promise<R>;

  findById(id: number): Promise<M>;

  create(data: MI): Promise<M>;

  updateById(id: number, data: MI): Promise<M>;

  deleteById(id: number): Promise<M>;
}
