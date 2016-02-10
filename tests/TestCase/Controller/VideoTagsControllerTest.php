<?php
namespace App\Test\TestCase\Controller;

use App\Controller\VideoTagsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\VideoTagsController Test Case
 */
class VideoTagsControllerTest extends MyIntegrationTestCase
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
        'app.riders',        
        'app.video_tags',
        'app.categories',
        'app.tags',
        'app.video_tag_points',
        'app.sports'
    ];


    /**
     * Test view method
     *
     * @return void
     */
    public function testView()
    {
        $id = 1;
        $this->get("/VideoTags/view/$id.json");
        
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
    }
    
    /**
     * Test add method
     *
     * @return void
     */
    public function testSearch()
    {   
        $this->get('/VideoTags/search.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $first = $result[0];
        $this->assertArrayHasKey('tag_id', $first);
        $this->assertArrayHasKey('tag_name', $first);
        $this->assertArrayHasKey('video_id', $first);
        $this->assertArrayHasKey('video_url', $first);
        $this->assertArrayHasKey('begin', $first);
        $this->assertArrayHasKey('end', $first);
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAddWithoutRider()
    {   
        $this->logUser();
        $data = [
            'video_id' => 1,
            'tag_id' => 1,
            'begin' => 2,
            'end' => 10
        ];
        $this->post('/VideoTags/add.json', $data);
        
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
        $this->assertTrue($result->success);
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAddWithRider()
    {   
        $riderId = 1;
        $this->logUser();
        $data = [
            'video_id' => 1,
            'tag_id' => 1,
            'begin' => 2,
            'end' => 10,
            'rider_id' => $riderId
        ];
        $this->post('/VideoTags/add.json', $data);
        
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('video_tag_id', $result['data']);
        $this->assertArrayHasKey('tag_id', $result['data']);
        
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTag = $videoTagsTable->get($result['data']['video_tag_id']);
        $this->assertEquals($riderId, $videoTag->rider_id);
    }
    
    

    /**
     * Test add method
     *
     * @return void
     */
    public function testEditRider()
    {   
        $this->logUser();
        $riderId = 1;
        $tagId = 1;
        $data = [
            'rider_id' => $riderId
        ];
        $this->post('/VideoTags/edit/'.$tagId.'.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        debug($result);
        $this->assertTrue($result['success'], "Rider should be edited properly.");
        
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTag = $videoTagsTable->get($tagId);
        $this->assertEquals($riderId, $videoTag->rider_id);
    }

    /**
     * Test add invalid time range
     *
     * @return void
     */
    public function testAddInvalidTimeRange() {
        // Add a video:
        $this->logUser();
        $data = [
            'video_id' => 1,
            'tag_id' => 1,
            'begin' => 2,
            'end' => 2 + (\App\Model\Table\VideoTagsTable::MIN_TAG_DURATION - 1)
        ];
        $this->post('/VideoTags/add.json', $data);
        
        $this->assertResponseOk();
        $result = json_decode($this->_response->body());
//       debug($result);
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->VideoTags->end);
        
        
        $data = [
            'video_id' => 1,
            'tag_id' => 1,
            'begin' => 2,
            'end' => 2 + \App\Model\Table\VideoTagsTable::MAX_TAG_DURATION + 1
        ];
        $this->post('/VideoTags/add.json', $data);
        $result = json_decode($this->_response->body());
//        debug($result);
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->VideoTags->end);
        
    }
    
    
}
