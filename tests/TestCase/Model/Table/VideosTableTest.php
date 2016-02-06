<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\VideosTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\VideosTable Test Case
 */
class VideosTableTest extends TestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_providers',
        'app.videos',
        'app.users',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Videos') ? [] : ['className' => 'App\Model\Table\VideosTable'];
        $this->Videos = TableRegistry::get('Videos', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Videos);

        parent::tearDown();
    }


    /**
     * Test adding a similar tag 
     * TODO
     * @return void
     */
    public function testAdd() {
        // Add a video:
        $data = [
            'user_id' => 1,
            'provider_id' => 'youtube',
            'video_url' => 'xb5LHuZGXi0',
        ];
        $video = $this->Videos->newEntity($data);
        $video->user_id = 1;
        if (!$this->Videos->save($video)){
            $this->assertTrue(false);
        }            
        $this->assertGreaterThanOrEqual(0, $video->duration);
    }

}