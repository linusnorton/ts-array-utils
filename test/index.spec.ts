import * as chai from "chai";
import {
  groupBy,
  indexBy,
  keyValue, nestedObjectFind,
  nestedObjectSearch,
  preferentialKeySearch,
  product, pushNested, safeGet,
  setNested
} from "../src/";


interface Animal {
  type: string;
  name: string;
}

type AnimalGroupedIndex = Record<string, Animal[]>;
type AnimalIndex = Record<string, Animal>;
type NestedAnimalIndex = {
  [type: string]: {
    [name: string]: Animal
  }
};
type NestedAnimalList = {
  [type: string]: {
    [name: string]: Animal[]
  }
};

describe("indexBy", () => {

  it("indexes items", () => {
    const animals: Animal[] = [
      { type: "cat", name: "Kitty" },
      { type: "cow", name: "MooMoo" },
      { type: "dog", name: "Barky" },
      { type: "dog", name: "Barky2" },
      { type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce(indexBy(animal => animal.type), {} as AnimalIndex);

    chai.expect(nameByType["cat"]).to.deep.equal({ type: "cat", name: "Kitty" });
    chai.expect(nameByType["cow"]).to.deep.equal({ type: "cow", name: "MooMoo" });
    chai.expect(nameByType["dog"]).to.deep.equal({ type: "dog", name: "Barky2" });
    chai.expect(nameByType["fish"]).to.deep.equal({ type: "fish", name: "Bloop" });
  });

});

describe("groupBy", () => {

  it("indexes items", () => {
    const animals = [
      { type: "cat", name: "Kitty" },
      { type: "cow", name: "MooMoo" },
      { type: "dog", name: "Barky" },
      { type: "dog", name: "Barky2" },
      { type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce(groupBy(animal => animal.type), {} as AnimalGroupedIndex);

    chai.expect(nameByType["cat"]).to.deep.equal([{ type: "cat", name: "Kitty" }]);
    chai.expect(nameByType["cow"]).to.deep.equal([{ type: "cow", name: "MooMoo" }]);
    chai.expect(nameByType["dog"]).to.deep.equal([{ type: "dog", name: "Barky" }, { type: "dog", name: "Barky2" }]);
    chai.expect(nameByType["fish"]).to.deep.equal([{ type: "fish", name: "Bloop" }]);
  });

});

describe("setNested", () => {

  it("deeply sets items", () => {
    const animals = [
      { type: "cat", name: "Kitty" },
      { type: "cow", name: "MooMoo" },
      { type: "dog", name: "Barky" },
      { type: "dog", name: "Barky2" },
      { type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce((index, item) => setNested(item, index, item.type, item.name), {} as NestedAnimalIndex);

    chai.expect(nameByType["cat"]["Kitty"]).to.deep.equal({ type: "cat", name: "Kitty" });
    chai.expect(nameByType["cow"]["MooMoo"]).to.deep.equal({ type: "cow", name: "MooMoo" });
    chai.expect(nameByType["dog"]["Barky"]).to.deep.equal({ type: "dog", name: "Barky" });
    chai.expect(nameByType["dog"]["Barky2"]).to.deep.equal({ type: "dog", name: "Barky2" });
    chai.expect(nameByType["fish"]["Bloop"]).to.deep.equal({ type: "fish", name: "Bloop" });
  });

  it("works with numeric keys", () => {
    const animals = [
      { age: 1, type: "cat", name: "Kitty" },
      { age: 2, type: "cow", name: "MooMoo" },
      { age: 1, type: "dog", name: "Barky" },
      { age: 2, type: "dog", name: "Barky2" },
      { age: 3, type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce((index, item) => setNested(item, index, item.age, item.name), {} as NestedAnimalIndex);

    chai.expect(nameByType[1]["Kitty"]).to.deep.equal({ age: 1, type: "cat", name: "Kitty" });
    chai.expect(nameByType[2]["MooMoo"]).to.deep.equal({ age: 2, type: "cow", name: "MooMoo" });
    chai.expect(nameByType[1]["Barky"]).to.deep.equal({ age: 1, type: "dog", name: "Barky" });
    chai.expect(nameByType[2]["Barky2"]).to.deep.equal({ age: 2, type: "dog", name: "Barky2" });
    chai.expect(nameByType[3]["Bloop"]).to.deep.equal({ age: 3, type: "fish", name: "Bloop" });
  });

});

describe("pushNested", () => {

  it("deeply sets items", () => {
    const animals = [
      { type: "cat", name: "Kitty" },
      { type: "cow", name: "MooMoo" },
      { type: "dog", name: "Barky" },
      { type: "dog", name: "Barky" },
      { type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce((index, item) => pushNested(item, index, item.type, item.name), {} as NestedAnimalList);

    chai.expect(nameByType["cat"]["Kitty"]).to.deep.equal([{ type: "cat", name: "Kitty" }]);
    chai.expect(nameByType["cow"]["MooMoo"]).to.deep.equal([{ type: "cow", name: "MooMoo" }]);
    chai.expect(nameByType["dog"]["Barky"]).to.deep.equal([{ type: "dog", name: "Barky" }, { type: "dog", name: "Barky" }]);
    chai.expect(nameByType["fish"]["Bloop"]).to.deep.equal([{ type: "fish", name: "Bloop" }]);
  });

});

describe("keyValue", () => {

  it("indexes items", () => {
    const animals = [
      { type: "cat", name: "Kitty" },
      { type: "cow", name: "MooMoo" },
      { type: "dog", name: "Barky" },
      { type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce(keyValue(animal => [animal.type, animal.name]), {} as Record<string, string>);

    chai.expect(nameByType["cat"]).to.equal("Kitty");
    chai.expect(nameByType["cow"]).to.equal("MooMoo");
    chai.expect(nameByType["dog"]).to.equal("Barky");
    chai.expect(nameByType["fish"]).to.equal("Bloop");
  });

});

describe("preferentialKeySearch", () => {

  it("returns items in order of preference", () => {
    const animals = {
      cat: { name: "Kitty" },
      cow: { name: "MooMoo" },
      dog: { name: "Barky"  },
      fish: { name: "Bloop" }
    };

    const favouriteAnimals = preferentialKeySearch(animals, "aardvark", "fish", "cow");

    chai.expect(favouriteAnimals).to.deep.equal([animals.fish, animals.cow]);
  });

});

describe("nestedObjectSearch", () => {

  it("returns valid options in order", () => {
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
      },
      "StationB": {
        "ALL": "50%",
        "StationA": "60%"
      }
    };

    chai.expect(Array.from(nestedObjectSearch(discounts, "ALL", "StationA", "StationB"))).to.deep.equal(["40%", "30%", "20%", "10%"]);
    chai.expect(Array.from(nestedObjectSearch(discounts, "ALL", "StationC", "StationB"))).to.deep.equal(["20%", "10%"]);
    chai.expect(Array.from(nestedObjectSearch(discounts, "ALL", "StationB", "StationC"))).to.deep.equal(["50%", "25%", "10%"]);
    chai.expect(Array.from(nestedObjectSearch(discounts, "ALL", "StationC", "StationD"))).to.deep.equal(["10%"]);
  });

});

describe("nestedObjectFind", () => {

  it("returns a single option", () => {
    const discounts = {
      "ALL": {
        "ALL": {
          "ALL": "15%",
          "00000": "10%"
        },
        "StationB": {
          "ALL": "25%"
        }
      },
      "StationA": {
        "ALL": {
          "ALL": "35%",
          "00000": "30%"
        }
      }
    };

    chai.expect(nestedObjectFind(discounts, "ALL", "StationA", "StationB", "00700")).to.equal("35%");
    chai.expect(nestedObjectFind(discounts, "ALL", "StationA", "StationB", "00000")).to.equal("30%");
    chai.expect(nestedObjectFind(discounts, "ALL", "StationC", "StationD", "00700")).to.equal("15%");
    chai.expect(nestedObjectFind(discounts, "ALL", "StationC", "StationD", "00000")).to.equal("10%");
    chai.expect(nestedObjectFind(discounts, "ALL", "StationC", "StationB", "00700")).to.equal("25%");
    chai.expect(nestedObjectFind(discounts, "ALL", "StationC", "StationB", "00000")).to.equal("25%");
  });

});

describe("product", () => {

  it("returns the cartesian product of array", () => {
    const array1 = [1, 2, 3];
    const array2 = ["a", "b"];
    const array3 = [2, 3, 4];

    chai.expect(product(array1, array2, array3)).to.deep.equal([
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
      [3, "b", 4],
    ]);
  });

});

describe("safeGet", () => {

  it("returns undefined for unknown values", () => {
    const obj = {
      type: {
        name: {
          value: 6
        }
      }
    };

    chai.expect(safeGet(obj, "type", "nam_", "value")).to.equal(undefined);
    chai.expect(safeGet(obj, "type", "name", "derp")).to.equal(undefined);
  });

  it("returns a value for existing properties", () => {
    const obj = {
      type: {
        name: {
          value: 6
        },
        second: {
          value: undefined
        }
      }
    };

    chai.expect(safeGet(obj, "type", "name", "value")).to.equal(6);
    chai.expect(safeGet(obj, "type", "second", "value")).to.equal(undefined);
  });
});