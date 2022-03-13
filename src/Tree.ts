/**
 * @module Tree
 */

type IteratorValue<T> = [index: number, node: T];

type Resolve<T> = (node: T, index: number) => T[] | void;

type Waiting<T> = Iterator<[index: number, value: T], undefined>;

/**
 * @class Tree
 * @description An iterable tree.
 */
export class Tree<T> {
  private roots: T[];

  /**
   * @constructor
   * @description An iterable tree.
   * @param tree tree nodes.
   * @param resolve Tree node resolve function.
   */
  constructor(tree: T, private resolve: Resolve<T>) {
    this.roots = [tree];
  }

  /**
   * @method dfs
   * @description The dfs traversal iterator.
   * @param backtrace Backtracking callback function.
   */
  *dfs(backtrace?: () => void): Iterable<IteratorValue<T>> {
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
