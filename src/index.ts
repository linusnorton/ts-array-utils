
export type MapOf<A> = {
  [key: string]: A
}

export type Reducer<ResultT, ItemT> = (prev: MapOf<ResultT>, item: ItemT) => MapOf<ResultT>;

/**
 * Return a function that can be used to reduce an array to an object of A indexed by the string returned by the given
 * function.
 *
 * Example usage:
 *
 * const people = [{name: "Bob", age: 1}, {name: "Bill", age: 2}];
 * const peopleByName = people.reduce(indexBy(person => person.name), {});
 *
 * {
 *   Bob: {name: "Bob", age: 1},
 *   Bill: {name: "Bill", age: 2}
 * }
 *
 */
export function indexBy<Item>(fn: (any: Item) => string | number): Reducer<Item, Item> {
  return function(prev: MapOf<Item>, item: Item): MapOf<Item> {
    prev[fn(item)] = item;

    return prev;
  }
}

/**
 * Return a function that can be used to reduce an array to an object of A[] indexed by the string returned by the given
 * function.
 *
 * Example usage:
 *
 * const people = [{name: "Bob", age: 1}, {name: "Bill", age: 2}, {name: "Bob", age: 3}];
 * const peopleByName = people.reduce(indexBy(person => person.name), {});
 *
 * {
 *   Bob: [{name: "Bob", age: 1}, {name: "Bob", age: 3}],
 *   Bill: [{name: "Bill", age: 2}]
 * }
 *
 */
export function groupBy<A>(fn: (item: A) => string | number): Reducer<A[], A> {
  return function(prev: MapOf<A[]>, item: A) {
    const key = fn(item);
    (prev[key] = prev[key] || []).push(item);

    return prev;
  }
}


/**
 * Utility function that safely creates a nested object using the given keys and sets the value to the final key.
 *
 * const peopleIndex = {
 *   UK: {
 *     London: { name: "Bob", country: "UK", city: "London" },
 *     Norwich: { name: "Mary", country: "UK", city: "Norwich" }
 *   },
 *   US: {
 *     Pawnee: { name: "Leslie", country: "US", city: "Pawnee" }
 *   }
 * };
 *
 * const newIndex = setNested({ name: "John", country: "AU", city: "Perth"}, peopleIndex, "country", "city");
 *
 * {
 *   UK: {
 *     London: { name: "Bob", country: "UK", city: "London"},
 *     Norwich: { name: "Mary", country: "UK", city: "Norwich"}
 *   },
 *   US: {
 *     Pawnee: { name: "Leslie", country: "US", city: "Pawnee"}
 *   },
 *   AU: {
 *     Perth: { name: "John", country: "AU", city: "Perth"}
 *   }
 * };
 */
export function setNested<T extends object>(value: any, root: T, ...keys: string[]): T {
  let base = root;

  for (const key of keys.slice(0, -1)) {
    base = base[key] = base[key] || {};
  }

  const lastKey = keys[keys.length -1];

  base[lastKey] = base[lastKey] || [];
  base[lastKey].push(value);

  return root;
}


/**
 * Utility function that safely creates a nested object using the given keys and pushes the value to the final key.
 *
 * const peopleIndex = {
 *   UK: {
 *     London: [{ name: "Bob", country: "UK", city: "London"}],
 *     Norwich: [{ name: "Mary", country: "UK", city: "Norwich"}],
 *   },
 *   US: {
 *     Pawnee: [{ name: "Leslie", country: "US", city: "Pawnee"}]
 *   }
 * };
 *
 * const newIndex = pushNested({ name: "John", country: "UK", city: "London"}, peopleIndex, "country", "city");
 *
 * {
 *   UK: {
 *     London: [
 *       { name: "Bob", country: "UK", city: "London"},
 *       { name: "John", country: "UK", city: "London"}
 *     ],
 *     Norwich: [{ name: "Mary", country: "UK", city: "Norwich"}],
 *   },
 *   US: {
 *     Pawnee: [{ name: "Leslie", country: "US", city: "Pawnee"}]
 *   }
 * };
 */
export function pushNested<T extends object, U>(value: U, root: T, ...keys: string[]): T {
  let base = root;

  for (const key of keys.slice(0, -1)) {
    base = base[key] = base[key] || {};
  }

  const lastKey = keys[keys.length -1];

  base[lastKey] = base[lastKey] || [];
  base[lastKey].push(value);

  return root;
}

/**
 * Given a map of T this function will examine each key in left to right order and add the values of those keys to an
 * array.
 *
 * Example usage:
 *
 * const animals = { cat: { name: "Kitty" }, cow: { name: "MooMoo" }, dog: { name: "Barky"  }, fish: { name: "Bloop" } }
 * const favouriteAnimals = preferentialKeySearch(animals, "aardvark", "fish", "cow");
 *
 * There are no aardvarks so you get your first preference of fish followed by cow:
 *
 * [
 *   { name: "Bloop" },
 *   { name: "MooMoo" },
 * ]
 *
 * This method is useful for searching through multiple keys and falling back to another key if the first is not found.
 *
 */
export function preferentialKeySearch<T>(obj: { [key: string]: T }, ...keys: string[]): T[] {
  const values: T[] = [];

  for (const key of keys) {
    if (obj[key]) {
      values.push(obj[key]);
    }
  }

  return values;
}

/**
 * This function recursively search through object tree using the given keys. Results are yielded in order of
 * preference. If at any point one of the keys is not set it will fallback to the fallbackKey.
 *
 * Example Usage:
 *
 * discounts: {
 *   "ALL": {
 *     "ALL": "10%",
 *     "StationA": "15%",
 *     "StationB": "20%",
 *     "StationC": "25%"
 *   },
 *   "StationA": {
 *     "ALL": "30%",
 *     "StationB": "40%"
 *   }
 *   "StationB": {
 *     "ALL": "50%",
 *     "StationA": "60%"
 *   }
 * }
 *
 * nestedObjectSearch(discounts, "ALL", "StationA", "StationB"); // ["40%", "30%", "20%", "10%"]
 * nestedObjectSearch(discounts, "ALL", "StationC", "StationB"); // ["20%", "10%"]
 * nestedObjectSearch(discounts, "ALL", "StationB", "StationC"); // ["50%", "25%", "10%"],
 * nestedObjectSearch(discounts, "ALL", "StationC", "StationD"); // ["10%"]
 */
export function *nestedObjectSearch(obj: any, fallbackKey: string, ...keys: string[]): any | undefined {
  // find all the results at this search level
  const values = preferentialKeySearch(obj, keys[0], fallbackKey);

  for (const value of values) {
    // if this is the last iteration return the values
    if (keys.length === 1) {
      yield value;
    }
    // otherwise continue to go deeper into the object
    else {
      yield* nestedObjectSearch(value, fallbackKey, ...keys.slice(1));
    }
  }
}

/**
 * Flatten an array of arrays into a single array.
 *
 * Example usage:
 *
 * const arrays = [
 *   [1, 2, 3],
 *   [2, 3, 4],
 *   [3, 4, 5]
 * ];
 *
 * flatten(arrays) //[1, 2, 3, 2, 3, 4, 3, 4, 5];
 */
export function flatten<T>(arr: T[][]): T[] {
  return [].concat.apply([], arr);
}

/**
 * Return the cartesian product of the given arrays. Unfortunately accurate type information is not possible until variadic types are implemented.
 *
 * See https://github.com/Microsoft/TypeScript/issues/5453
 *
 * Credit: Edd Mann (http://eddmann.com/posts/cartesian-product-in-javascript/)
 *
 * Example usage:
 *
 * const array1 = [1, 2, 3];
 * const array2 = ["a", "b"];
 * const array3 = [2, 3, 4];
 *
 * product(array1, array2, array3)
 *
 * [
 *   [1, "a", 2],
 *   [1, "a", 3],
 *   [1, "a", 4],
 *   [1, "b", 2],
 *   [1, "b", 3],
 *   [1, "b", 4],
 *   [2, "a", 2],
 *   [2, "a", 3],
 *   [2, "a", 4],
 *   [2, "b", 2],
 *   [2, "b", 3],
 *   [2, "b", 4],
 *   [3, "a", 2],
 *   [3, "a", 3],
 *   [3, "a", 4],
 *   [3, "b", 2],
 *   [3, "b", 3],
 *   [3, "b", 4]
 * ]
 */
export function product(...sets: any[][]): any[][] {
  return sets.reduce((acc, set) => flatten(acc.map(x => set.map(y => [ ...x, y ]))), [[]]);
}
