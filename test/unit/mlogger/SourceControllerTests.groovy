package mlogger



import org.junit.*
import grails.test.mixin.*

@TestFor(SourceController)
@Mock(Source)
class SourceControllerTests {

    def populateValidParams(params) {
        assert params != null
        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
    }

    void testIndex() {
        controller.index()
        assert "/source/list" == response.redirectedUrl
    }

    void testList() {

        def model = controller.list()

        assert model.sourceInstanceList.size() == 0
        assert model.sourceInstanceTotal == 0
    }

    void testCreate() {
        def model = controller.create()

        assert model.sourceInstance != null
    }

    void testSave() {
        controller.save()

        assert model.sourceInstance != null
        assert view == '/source/create'

        response.reset()

        populateValidParams(params)
        controller.save()

        assert response.redirectedUrl == '/source/show/1'
        assert controller.flash.message != null
        assert Source.count() == 1
    }

    void testShow() {
        controller.show()

        assert flash.message != null
        assert response.redirectedUrl == '/source/list'

        populateValidParams(params)
        def source = new Source(params)

        assert source.save() != null

        params.id = source.id

        def model = controller.show()

        assert model.sourceInstance == source
    }

    void testEdit() {
        controller.edit()

        assert flash.message != null
        assert response.redirectedUrl == '/source/list'

        populateValidParams(params)
        def source = new Source(params)

        assert source.save() != null

        params.id = source.id

        def model = controller.edit()

        assert model.sourceInstance == source
    }

    void testUpdate() {
        controller.update()

        assert flash.message != null
        assert response.redirectedUrl == '/source/list'

        response.reset()

        populateValidParams(params)
        def source = new Source(params)

        assert source.save() != null

        // test invalid parameters in update
        params.id = source.id
        //TODO: add invalid values to params object

        controller.update()

        assert view == "/source/edit"
        assert model.sourceInstance != null

        source.clearErrors()

        populateValidParams(params)
        controller.update()

        assert response.redirectedUrl == "/source/show/$source.id"
        assert flash.message != null

        //test outdated version number
        response.reset()
        source.clearErrors()

        populateValidParams(params)
        params.id = source.id
        params.version = -1
        controller.update()

        assert view == "/source/edit"
        assert model.sourceInstance != null
        assert model.sourceInstance.errors.getFieldError('version')
        assert flash.message != null
    }

    void testDelete() {
        controller.delete()
        assert flash.message != null
        assert response.redirectedUrl == '/source/list'

        response.reset()

        populateValidParams(params)
        def source = new Source(params)

        assert source.save() != null
        assert Source.count() == 1

        params.id = source.id

        controller.delete()

        assert Source.count() == 0
        assert Source.get(source.id) == null
        assert response.redirectedUrl == '/source/list'
    }
}
