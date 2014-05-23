/**
 * A simple "hello world" test file (with no app dependencies yet).
 */
define([], function () {
  describe("My Test Suite", function () {
    it("should be true", function () {
      expect(true).to.be.true;
    });

    it("should be false", function () {
      expect(false).to.be.false;
    });
  });
});
