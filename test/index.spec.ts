import * as chai from "chai";
import {flatten, keyValue, nestedObjectSearch, preferentialKeySearch, product} from "../src/";

describe("keyValue", () => {

  it("indexes items", () => {
    const animals = [
      { type: "cat", name: "Kitty" },
      { type: "cow", name: "MooMoo" },
      { type: "dog", name: "Barky" },
      { type: "fish", name: "Bloop" }
    ];

    const nameByType = animals.reduce(keyValue(animal => [animal.type, animal.name]), {});

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

describe("flatten", () => {

  it("flattens nested arrays", () => {
    const arrays = [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ];

    chai.expect(flatten(arrays)).to.deep.equal([1, 2, 3, 2, 3, 4, 3, 4, 5]);
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