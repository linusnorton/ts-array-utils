# ts-array-utils

Miscellaneous array utilities written in TypeScript.

## Install

```
npm install --save ts-array-utils
```

## Documentation

### indexBy<Item>(fn: (any: Item) => string | number): Reducer<Item, Item>


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

### groupBy<A>(fn: (item: A) => string | number): Reducer<A[], A>

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

### setNested<T extends object>(value: any, root: T, ...keys: string[]): T

Utility function that safely creates a nested object using the given keys and sets the value to the final key.

```
const peopleIndex = {
  UK: {
    London: { name: "Bob", country: "UK", city: "London" },
    Norwich: { name: "Mary", country: "UK", city: "Norwich" }
  },
  US: {
    Pawnee: { name: "Leslie", country: "US", city: "Pawnee" }
  }
};

const newIndex = setNested({ name: "John", country: "AU", city: "Perth"}, peopleIndex, "country", "city");

{
  UK: {
    London: { name: "Bob", country: "UK", city: "London"},
    Norwich: { name: "Mary", country: "UK", city: "Norwich"}
  },
  US: {
    Pawnee: { name: "Leslie", country: "US", city: "Pawnee"}
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
const peopleIndex = {
  UK: {
    London: [{ name: "Bob", country: "UK", city: "London"}],
    Norwich: [{ name: "Mary", country: "UK", city: "Norwich"}],
  },
  US: {
    Pawnee: [{ name: "Leslie", country: "US", city: "Pawnee"}]
  }
};
 
const newIndex = pushNested({ name: "John", country: "UK", city: "London"}, peopleIndex, "country", "city");
 
{
  UK: {
    London: [
      { name: "Bob", country: "UK", city: "London"},
      { name: "John", country: "UK", city: "London"}
    ],
    Norwich: [{ name: "Mary", country: "UK", city: "Norwich"}],
  },
  US: {
    Pawnee: [{ name: "Leslie", country: "US", city: "Pawnee"}]
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

## Testing

```
npm test
```

## Contributing

Issues, PRs and contributions are welcome. Please ensure any changes have an accompanying test.

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
