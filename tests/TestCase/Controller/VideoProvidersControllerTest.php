<?php
namespace App\Test\TestCase\Controller;

use App\Controller\VideoProvidersController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\VideoProvidersController Test Case
 */
class VideoProvidersControllerTest extends IntegrationTestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_providers'
    ];

    /**
     * Test index method
     *
     * @return void
     */
    public function testIndex(){
        $this->get('/api/video_providers/index.json');
        $this->assertResponseOk();
    }
}
