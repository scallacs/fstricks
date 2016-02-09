describe('form-add-rider', function() {
    var compile, scope, directiveElem;

    beforeEach(function() {
        module('app.rider');

        inject(function($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });

        directiveElem = getCompiledElement();
    });

    it('should have span element', function() {
        var spanElement = directiveElem.find('span');
        expect(spanElement).toBeDefined();
        expect(spanElement.text()).toEqual('This span is appended from directive.');
    });

    function getCompiledElement() {
        var element = angular.element('<div first-directive></div>');
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }
});