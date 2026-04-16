/**
 * @module Tree
 */

export type IteratorValue<T> = [index: number, node: T];

export type Resolve<T> = (node: T, index: number) => T[] | void;

export type Waiting<T> = Iterator<[index: number, value: T], void>;

/**
 * @class Tree
 * @description An iterable tree.
 */
export class Tree<T> {
  private roots: T[];
  private resolve: Resolve<T>;

  /**
   * @constructor
   * @description An iterable tree.
   * @param tree tree nodes.
   * @param resolve Tree node resolve function.
   */
  constructor(tree: T, resolve: Resolve<T>) {
    this.roots = [tree];
    this.resolve = resolve;
  }

  /**
   * @method dfs
   * @description The dfs traversal iterator.
   * @param onInternalDone Internal node traversal done event.
   */
  public *dfs(onInternalDone?: () => void): Iterable<IteratorValue<T>> {
    const { roots, resolve } = this;
    const waiting: Waiting<T>[] = [];

    let current: Waiting<T> | undefined = roots.entries();

    while (current) {
      const item = current.next();

      if (item.done) {
        current = waiting.pop();

        onInternalDone && onInternalDone();
      } else {
        const [index, node] = item.value;
        const children = resolve(node, index);

        if (children != null) {
          waiting.push(current);

          current = children.entries();
        }

        yield [index, node];
      }
    }
  }
}
