import Observables from "../../src/lib/helpers/Observables";

describe("Observable", () => {
  it("obs", () => {
    let ob = Observables.create(5);
    ob.subscribe((newVal, oldVal) => {
      expect(newVal).toBe(10);
      expect(oldVal).toBe(5);
    });
    ob.set(10);
    expect(ob.get()).toBe(10);
  });
});
