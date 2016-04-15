describe('EditionTag', function () {
    var EditionTag, editionTag;

    beforeEach(function () {
        module('app.tag');
        inject(function ($injector) {
            EditionTag = $injector.get('EditionTag');
        });
    });

    it('Should be created', function () {
        var editionTag = new EditionTag();

    });
    it('Should be possible to cancel changes', function () {
        var editionTag = new EditionTag();

        editionTag.setRider({id: 133})
        expect(editionTag.hasRider()).toBe(true);

        editionTag.setCategory({id: 133})
        expect(editionTag.hasCategory()).toBe(true);


    });
});