import { v4 as uuidv4 } from "uuid";

export type Data<T> = T & {
  [key: string]: any;
} & {
  id?: string;
};

export class InMemoryDB<T> {
  private map: Map<string, Data<T>> = new Map();

  public create(data: Data<T>) {
    const id = uuidv4();
    this.map.set(id, { ...data, id });
    return this.map.get(id);
  }

  public updateOnce(find: Data<T>, update: Data<T>) {
    const result = this.findOnce(find);
    if (result && result.id)
      this.map.set(result.id, { ...result, ...update, id: result.id });
  }

  public update(find: Data<T>, update: Data<T>) {
    const results = this.find(find);
    for (const result of results)
      if (result && result.id)
        this.map.set(result.id, { ...result, ...update, id: result.id });
  }

  public removeOnce(where: Data<T>) {
    const result = this.findOnce(where);
    if (result && result.id) this.map.delete(result.id);
  }

  public remove(where: Data<T>) {
    const results = this.find(where);
    for (const result of results)
      if (result && result.id) this.map.delete(result.id);
  }

  public findOnce(where: Data<T>) {
    return this.find(where, true)[0];
  }

  public find(where: Data<T>, once: boolean = false) {
    const results: Data<T>[] = [];

    for (const data of this.map.values()) {
      if (once && results.length > 0) break;

      const whereKeys = Object.keys(where);

      if (whereKeys.length === 0) {
        results.push(data);
      } else {
        for (const key of whereKeys) {
          if (where[key] != null && where[key] === data[key]) {
            results.push(data);
            break;
          }
        }
      }
    }

    return results;
  }
}
