<?php

use App\Lib\ResultMessage;

/**
 * Description of ResultMessageTest
 *
 * @author stephane
 */
class ResultMessageTest extends \Cake\TestSuite\TestCase {

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        ResultMessage::reset();
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown() {
        parent::tearDown();
    }

    /**
     * Test adding with accents and upper case
     * @return void
     */
    public function testWithWrapper() {
        ResultMessage::setWrapper(true);
        ResultMessage::setMessage("test", true);
        ResultMessage::setSuccess();
        
        $this->assertTrue(ResultMessage::hasMessage());
        $this->assertTrue(ResultMessage::hasWrapper());

        $this->assertEquals([
            'message' => 'test',
            'success' => true
                ], ResultMessage::render());

        ResultMessage::setData("a", "b");

        $expected = [
            'message' => 'test',
            'success' => true,
            "data" => [
                'a' => 'b'
            ]
        ];
        $this->assertEquals($expected, ResultMessage::render());

        ResultMessage::setReturnCode(33);
        $expected['returnCode'] = 33;
        $this->assertEquals($expected, ResultMessage::render());

        ResultMessage::setToken('A');
        $expected['data']['token'] = 'A';
        $this->assertEquals($expected, ResultMessage::render());
    }

    /**
     * Test adding with accents and upper case
     * @return void
     */
    public function testNoWrapper() {
        ResultMessage::setWrapper(false);

        ResultMessage::setMessage("test");
        ResultMessage::setSuccess();
        ResultMessage::setData("a", "b");

        $this->assertEquals(['a' => 'b'], ResultMessage::render());

        ResultMessage::overwriteData([1, 2, 3]);
        $this->assertEquals([1, 2, 3], ResultMessage::render());
    }

    /**
     * Test adding with accents and upper case
     * @return void
     */
    public function testSteps() {
        ResultMessage::setWrapper(true);

        ResultMessage::addStepsError(["error"]);
        ResultMessage::addStepsSuccess(["success"]);
        $this->assertEquals([
            'message' => null,
            'success' => false,
            'details' => [
                [
                    'type' => "error",
                    'message' => "error"
                ],
                [
                    'type' => "success",
                    'message' => "success"
                ]
            ]
                ], ResultMessage::render());

        ResultMessage::reset();
        ResultMessage::addStepSuccess("success");
        $this->assertEquals([
            'message' => null,
            'success' => false,
            'details' => [
                [
                    'type' => "success",
                    'message' => "success"
                ]
            ]
                ], ResultMessage::render());

    }

    /**
     * Test adding with accents and upper case
     * @return void
     */
    public function testModelError() {
        ResultMessage::setWrapper(true);
        ResultMessage::setValidationErrors(['Rider' => ['name' => 'Invalid']]);

        ResultMessage::reset();
        ResultMessage::setWrapper(true);
        $entity = new \Cake\ORM\Entity();
        $entity->source('source');
        $entity->errors('test', ['message']);
        ResultMessage::addValidationErrorsModel($entity, true);
        $expected = [
            'message' => ResultMessage::MESSAGE_VALIDATION_ERRORS,
            'success' => false,
            'validationErrors' => [
                'source' => [
                    'test' => ['message']
                ]
            ]
        ];
        $this->assertEquals($expected, ResultMessage::render());
    }

    /**
     * Test adding with accents and upper case
     * @return void
     */
    public function testPaginate() {
        ResultMessage::setWrapper(false);
        ResultMessage::setPaginateData([1, 2], [
            'count' => 2,
            'perPage' => 5
        ]);
        $expected = [
            'items' => [1,2],
            'count' => 2,
            'perPage' => 5
        ];
        $this->assertEquals($expected, ResultMessage::render());
    }
}
