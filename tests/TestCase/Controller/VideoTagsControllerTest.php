<?php
namespace App\Test\TestCase\Controller;

use App\Controller\VideoTagsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\VideoTagsController Test Case
 */
class VideoTagsControllerTest extends IntegrationTestCase
{

    
    private function logUser(){
        // Set session data
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => 1,
                    'username' => 'testing',
                ]
            ]
        ]);
    }
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
    public function testAdd()
    {
        // Add a video:
        $videoTable = \Cake\ORM\TableRegistry::get('Videos');
        $data = [
            'provider_id' => 'youtube',
            'video_url' => 'xb5LHuZGXi0',
        ];
        $videoTable->deleteAll($data);
        $video = $videoTable->newEntity($data);
        $video->user_id = 1;
        if (!$videoTable->save($video)){
            debug($video);
            $this->assertTrue(false);
        }
        
        $this->logUser();
        $data = [
            'video_id' => $video->id,
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
     * Test add invalid time range
     *
     * @return void
     */
    public function testAddInvalidTimeRange() {
        // Add a video:
        $videoTable = \Cake\ORM\TableRegistry::get('Videos');
        $data = [
            'provider_id' => 'youtube',
            'video_url' => 'xb5LHuZGXi0',
        ];
        $videoTable->deleteAll($data);
        $video = $videoTable->newEntity($data);
        $video->user_id = 1;
        if (!$videoTable->save($video)){
            debug($video);
            $this->assertTrue(false);
        }
        
        $this->logUser();
        
        $data = [
            'video_id' => $video->id,
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
            'video_id' => $video->id,
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
    
    
    /**
     * Test adding a similar tag 
     *
     * @return void
     */
    public function testAddSimilarTag() {
        // Add a video:
        $videoTable = \Cake\ORM\TableRegistry::get('Videos');
        $data = [
            'provider_id' => 'youtube',
            'video_url' => 'xb5LHuZGXi0',
        ];
        $videoTable->deleteAll($data);
        $video = $videoTable->newEntity($data);
        $video->user_id = 1;
        if (!$videoTable->save($video)){
            debug($video);
            $this->assertTrue(false);
        }
        
        $this->logUser();
    }

}
