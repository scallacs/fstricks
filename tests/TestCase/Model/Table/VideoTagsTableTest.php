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
     * Test adding a similar tag 
     */
    public function testAddSimilarTag() {
        // Add a video:
        $data = [
            'tag_id' => 1,
            'video_id' => 1,
            'begin' => 10,
            'end' => 12
        ];
        $video = $this->VideoTags->newEntity($data);
        $video->user_id = 1;
        $this->assertTrue((bool) $this->VideoTags->save($video));
        
        $data = [
            'tag_id' => 1,
            'video_id' => 1,
            'begin' => 10,
            'end' => 12
        ];
        $video = $this->VideoTags->newEntity($data);
        $video->user_id = 1;
        $this->assertFalse((bool) $this->VideoTags->save($video));
        
    }
    
    /**
     * Test adding a begin or end time bigger than the video duration
     * TODO
     */
    public function testInvalidTimeRange(){
        // TODO
    }
}
