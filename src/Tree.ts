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
   * @param backtrace Backtracking callback function.
   */
  public *dfs(backtrace?: () => void): Iterable<IteratorValue<T>> {
    const { roots, resolve } = this;
    const waiting: Waiting<T>[] = [];

    let current: Waiting<T> | undefined = roots.entries();

    while (current) {
      const item = current.next();

      if (item.done) {
        current = waiting.pop();

        backtrace && backtrace();
      } else {
        const [index, node] = item.value;
        const children = resolve(node, index);

        if (children && children.length > 0) {
          waiting.push(current);

          current = children.entries();
        }

        yield [index, node];
      }
    }
  }
}
