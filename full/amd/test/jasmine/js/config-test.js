/**
 * RequireJS Jasmine Testconfiguration
 */
(function () {
  require.config({
    baseUrl: "../../app/js/vendor",
    paths: {
      spec: "../../../test/jasmine/js/spec"
    }
  });
}());
