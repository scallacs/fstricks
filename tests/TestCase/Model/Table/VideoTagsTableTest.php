<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\VideoTagsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\VideoTagsTable Test Case
 */
class VideoTagsTableTest extends TestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_tags',
        'app.videos',
        'app.users',
        'app.tags',
        'app.spots',
        'app.spots_tags',
        'app.tags_users',
        'app.video_tag_points'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('VideoTags') ? [] : ['className' => 'App\Model\Table\VideoTagsTable'];
        $this->VideoTags = TableRegistry::get('VideoTags', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->VideoTags);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test adding a similar tag 
     * TODO
     * @return void
     */
    public function testAddSimilarTag() {
        // Add a video:
        $data = [
            'provider_id' => 'youtube',
            'video_url' => 'xb5LHuZGXi0',
        ];
        $video = $this->VideoTags->newEntity($data);
        $video->user_id = 1;
        if (!$this->VideoTags->save($video)){
            debug($video);
            $this->assertTrue(false);
        }
        
    }
}
