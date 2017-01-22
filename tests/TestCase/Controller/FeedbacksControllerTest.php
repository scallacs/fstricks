<?php
namespace App\Test\TestCase\Controller;

use App\Controller\FeedbacksController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\FeedbacksController Test Case
 */
class FeedbacksControllerTest extends \App\Test\Util\MyIntegrationTestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.feedbacks',
        'app.users',
    ];

    /**
     * Test index method
     *
     * @return void
     */
    public function testSend()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }


}
