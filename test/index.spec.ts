import * as chai from "chai";
import {nestedObjectSearch, preferentialKeySearch} from "../src/";

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