/**
 * A simple "hello world" test file (with no app dependencies yet).
 */
define([], function () {
  describe("My Test Suite", function () {
    it("should be true", function () {
      expect(true).toBeTruthy();
    });

    it("should be false", function () {
      expect(false).toBeFalsy();
    });
  });
});
