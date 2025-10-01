# ts-array-utils [![Build Status](https://travis-ci.org/linusnorton/ts-array-utils.svg?branch=master)](https://travis-ci.org/linusnorton/ts-array-utils)

Miscellaneous array utilities written in TypeScript. This library has no dependencies but does require many ES6 features.

## Install

```
npm install --save ts-array-utils
```

## Documentation

### indexBy<T>(fn: KeyGenerator<T>): Reducer<T, Record<string, T>


Return a function that can be used to reduce an array to an object of A indexed by the string returned by the given function.

Example usage:

```
const people = [{name: "Bob", age: 1}, {name: "Bill", age: 2}];
const peopleByName = people.reduce(indexBy(person => person.name), {});

{
   Bob: {name: "Bob", age: 1},
   Bill: {name: "Bill", age: 2}
}
```

### groupBy<T>(fn: KeyGenerator<T>: Reducer<T, Record<string, T>>

Return a function that can be used to reduce an array to an object of A[] indexed by the string returned by the given function.

Example usage:

```
const people = [{name: "Bob", age: 1}, {name: "Bill", age: 2}, {name: "Bob", age: 3}];
const peopleByName = people.reduce(indexBy(person => person.name), {});

{
   Bob: [{name: "Bob", age: 1}, {name: "Bob", age: 3}],
   Bill: [{name: "Bill", age: 2}]
}
```

### export function keyValue<T, U>(fn: (item: T) => [string, U]): Reducer<T, Record, string, U>

Return a function that can be used to reduce an array to an object of string -> A

Example usage:

```
const people = [{name: "Bob", age: 1}, {name: "Bill", age: 2}, {name: "Bob", age: 3}];
const ageByName = people.reduce(keyValue(person => [person.name, person.age]), {});

{
   Bob: 3,
   Bill: 2
}
```
Note that any duplicate keys are overridden.

### setNested<T extends object>(value: any, root: T, ...keys: string[]): T

Utility function that safely creates a nested object using the given keys and sets the value to the final key.

```
let peopleIndex = {};
const person1 = { name: "John", country: "AU", city: "Perth" };
const person1 = { name: "Bob", country: "UK", city: "London" };

peopleIndex = setNested(person1, peopleIndex, person1.country, person1.city);
peopleIndex = setNested(person2, peopleIndex, person2.country, person2.city);

{
  UK: {
    London: { name: "Bob", country: "UK", city: "London"},
  },
  AU: {
    Perth: { name: "John", country: "AU", city: "Perth"}
  }
};

```

### pushNested<T extends object, U>(value: U, root: T, ...keys: string[]): T

Safely creates a nested object using the given keys and pushes the value to the final key.

Example usage:

```
let peopleIndex = {};
const person1 = { name: "John", country: "UK", city: "London" };
const person2 = { name: "John", country: "UK", city: "London" };

peopleIndex = pushNested(person1, peopleIndex, person1.country, person1.city);
peopleIndex = pushNested(person2, peopleIndex, person2.country, person2.city);

{
  UK: {
    London: [
      { name: "Bob", country: "UK", city: "London"},
      { name: "John", country: "UK", city: "London"}
    ]
  }
};
```

### preferentialKeySearch<T>(obj: { [key: string]: T }, ...keys: string[]): T[]

Given a map of T this function will examine each key in left to right order and add the values of those keys to an array.

Example usage:

```
const animals = { cat: { name: "Kitty" }, cow: { name: "MooMoo" }, dog: { name: "Barky"  }, fish: { name: "Bloop" } }
const favouriteAnimals = preferentialKeySearch(animals, "aardvark", "fish", "cow");

[
   { name: "Bloop" },
   { name: "MooMoo" },
]

```

There are no aardvarks so you get your first preference of fish followed by cow.

This method is useful for searching through multiple keys and falling back to another key if the first is not found.

### *nestedObjectSearch(obj: any, fallbackKey: string, ...keys: string[]): any | undefined

This function recursively search through object tree using the given keys. Results are yielded in order of preference. If at any point one of the keys is not set it will fallback to the fallbackKey.

Example Usage:

```
const discounts = {
  "ALL": {
    "ALL": "10%",
    "StationA": "15%",
    "StationB": "20%",
    "StationC": "25%"
  },
  "StationA": {
    "ALL": "30%",
    "StationB": "40%"
  }
  "StationB": {
    "ALL": "50%",
    "StationA": "60%"
  }
};

nestedObjectSearch(discounts, "ALL", "StationA", "StationB"); // ["40%", "30%", "20%", "10%"]
nestedObjectSearch(discounts, "ALL", "StationC", "StationB"); // ["20%", "10%"]
nestedObjectSearch(discounts, "ALL", "StationB", "StationC"); // ["50%", "25%", "10%"],
nestedObjectSearch(discounts, "ALL", "StationC", "StationD"); // ["10%"]
```

### nestedObjectFind(obj: any, fallbackKey: string, ...keys: string[]): any | undefined

This function recursively search through object tree using the given keys. Unlike nestedObjectSearch this function will only return a single result. . If at any point one of the keys is not set it will fallback to the fallbackKey.

Example Usage:

```
const discounts = {
  "ALL": {
    "ALL": "10%",
    "StationA": "15%",
    "StationB": "20%",
    "StationC": "25%"
  },
  "StationA": {
    "ALL": "30%",
    "StationB": "40%"
  }
  "StationB": {
    "ALL": "50%",
    "StationA": "60%"
  }
};

nestedObjectFind(discounts, "ALL", "StationA", "StationB"); // "40%"
nestedObjectFind(discounts, "ALL", "StationC", "StationB"); // "20%"
nestedObjectFind(discounts, "ALL", "StationB", "StationC"); // "50%"
nestedObjectFind(discounts, "ALL", "StationC", "StationD"); // "10%"
```

### product<T extends readonly any[][]>(...sets: T): Array<{ [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never }>

Return the cartesian product of the given arrays with full type inference.

Credit: Edd Mann (http://eddmann.com/posts/cartesian-product-in-javascript/)

Example usage:

```
const array1 = [1, 2, 3];
const array2 = ["a", "b"];
const array3 = [2, 3, 4];

product(array1, array2, array3);

// output:
[
  [1, "a", 2],
  [1, "a", 3],
  [1, "a", 4],
  [1, "b", 2],
  [1, "b", 3],
  [1, "b", 4],
  [2, "a", 2],
  [2, "a", 3],
  [2, "a", 4],
  [2, "b", 2],
  [2, "b", 3],
  [2, "b", 4],
  [3, "a", 2],
  [3, "a", 3],
  [3, "a", 4],
  [3, "b", 2],
  [3, "b", 3],
  [3, "b", 4]
]
```

### safeGet<T>(obj: any, ...props: string[]): T | undefined 

Safely retrieve a nested object property.
 
Example usage:

```
const obj = {
  type: {
    name: {
      value: 6
    }
  }
};

safeGet(obj, "type", "name", "value"); // 6
safeGet(obj, "type", "name", "fail"); // undefined
```

## Testing

```
npm test
```

## Contributing

Issues, PRs and contributions are welcome. Please ensure any changes have an accompanying test.

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
