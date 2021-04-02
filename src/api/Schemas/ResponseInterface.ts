
type Meta<T> = {
  [P in keyof T]?: T[P];
}

type Data<T> = {
  [P in keyof T]?: T[P];
}

export default interface ResponseInterface<M, D> {
  meta?: Meta<M>;
  data: Data<D>;
}
