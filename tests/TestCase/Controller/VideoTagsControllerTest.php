<?php

namespace App\Test\TestCase\Controller;
use App\Controller\VideoTagsController;
use App\Test\Fixture\VideoTagsFixture;

/**
 * App\Controller\VideoTagsController Test Case
 */
class VideoTagsControllerTest extends \App\Test\TestCase\Controller\MyIntegrationTestCase {

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
        'app.video_tag_accuracy_rates',
        'app.sports'
    ];

    /**
     * Test view method
     *
     * @return void
     */
    public function testView() {
        $id = 1;
        $this->get("/api/VideoTags/view/$id.json");
        $this->assertResponseOk();
    }
    
    /**
     * Test view method
     *
     * @return void
     */
    public function testDeleteNotOwner() {
        $this->logUser(2);
        $this->post("/api/VideoTags/delete/".VideoTagsFixture::ID_PENDING.".json");
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
//        debug($result);
        $this->assertFalse($result['success']);
    }
    /**
     * Test view method
     *
     * @return void
     */
    public function testDeleteOwner() {
        $this->logUser(1);
        $this->post("/api/VideoTags/delete/".VideoTagsFixture::ID_PENDING.".json");
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
    }
    /**
     * Test view method
     *
     * @return void
     */
    public function testDeleteValidated() {
        $this->logUser(1);
        $this->post("/api/VideoTags/delete/".VideoTagsFixture::ID_VALIDATED.".json");
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertFalse($result['success']);
    }
    
    /**
     */
    public function testRecentlyTagged() {
        $this->logUser(1);
        $this->get("/api/VideoTags/recentlyTagged.json");
        $this->assertResponseOk();
    }

    /**
     */
    public function testSimilar() {
        $this->logUser(1);
        $this->post("/api/VideoTags/similar.json", [
            'VideoTag' => [
                'begin' => 5,
                'end' => 10,
                'video_id' => 1
            ]
        ]);
        $this->assertResponseOk();
//        $result = json_decode($this->_response->body(), true);
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testValidation() {
        $this->logUser();
        $this->get('/api/VideoTags/validation.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        //$this->assertCount($result, 1);
    }
    
    /**
     * Test add method
     *
     * @return void
     */
    public function testSearch() {
        $this->get('/api/VideoTags/search.json');
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertArrayHasKey('items', $result);
        $this->assertGreaterThan(0, count($result['items']));
        $first = $result['items'][0];
        $this->assertArrayHasKey('tag_id', $first);
        $this->assertArrayHasKey('tag_name', $first);
        $this->assertArrayHasKey('video_id', $first);
        $this->assertArrayHasKey('video_url', $first);
        $this->assertArrayHasKey('begin', $first);
        $this->assertArrayHasKey('end', $first);
    }

    /**
     * 
     *  - sport_id
     *  - category_id
     *  - tag_id
     *  - video_id
     *  - rider_id
     * - trick_name
     */
    public function testSearchParams() {
        $this->get('/api/VideoTags/search.json?tag_name=frontside');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?rider_id=1');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?sport_id=1');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?tag_id=1');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?trick-slug=frontside-360');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?order=invalidorder');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?order=begin_time');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?order=created');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?order=modified');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?order=best');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?video_tag_id=1');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?tag_slug=myslug');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?trick_slug=1');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?video_tag_ids=1,2,3');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?status=pending,invalidstatus');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?sport_name=snowboard');
        $this->assertResponseOk();
        $this->get('/api/VideoTags/search.json?sport_name=snowboard&category_name=jib');
        $this->assertResponseOk();
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAddWithoutRider() {
        $this->logUser();
        $data = [
            'video_id' => 1,
            'tag_id' => 1,
            'begin' => 2,
            'end' => 10
        ];
        $this->post('/api/VideoTags/add.json', $data);
        $this->assertResultMessageSuccess();
    }


    /**
     * Test add method
     *
     * @return void
     */
    public function testAddWithNewTag() {
        $this->logUser();
        $data = [
            'video_id' => 1,
            'tag' => [
                'sport_id' => 1,
                'category_id' => 1,
                'name' => 'testtesghttesttest'
            ],
            'begin' => 2,
            'end' => 10
        ];
        $this->post('/api/VideoTags/add.json', $data);
//        debug($this->bodyAsJson());
        $this->assertResultMessageSuccess();
    }
    /**
     * Test add method
     * TODO 
     * @return void
     */
    public function testEditWithNewTag() {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAddWithRider() {
        $riderId = 1;
        $this->logUser();
        $data = [
            'video_id' => 1,
            'tag_id' => 1,
            'begin' => 2,
            'end' => 10,
            'rider_id' => $riderId
        ];
        $this->post('/api/VideoTags/add.json', $data);

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
     * Test that a user cannot modify the video tag execpt the rider ? 
     *
     * @return void
     */
    public function testEditVideoTagNotOwner() {
        $tagId = \App\Test\Fixture\VideoTagsFixture::ID_PENDING;
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTagOrigin = $videoTagsTable->get($tagId);
        
        $this->logUser($videoTagOrigin->user_id + 1);
        $this->post('/api/VideoTags/edit/' . $tagId . '.json', ['rider_id' => 1]);
        $this->assertResponseError(404); // Not authorized
    }
    /**
     * Test that a user cannot modify the video tag execpt the rider ? 
     *
     * @return void
     */
    public function testEditVideoTag() {
        $tagId = \App\Test\Fixture\VideoTagsFixture::ID_PENDING;
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTagOrigin = $videoTagsTable->get($tagId);
        
        $this->logUser($videoTagOrigin->user_id);

        $data = [
            'begin' => $videoTagOrigin->begin + 1,
            'end' => $videoTagOrigin->end + 1,
            'video_id' => $videoTagOrigin->video_id + 1,
            'user_id' => $videoTagOrigin->user_id + 1,
            'tag_id' => $videoTagOrigin->tag_id + 1,
            'rider_id' => $videoTagOrigin->rider_id + 1,
            'count_tags' => 39232,
            'user_id' => $videoTagOrigin->user_id + 1,
            'created' => 2,
            'count_points' => 378293,
            'status' => \App\Model\Entity\VideoTag::STATUS_REJECTED
        ];
        $this->post('/api/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
//        debug($result);
        $this->assertTrue($result['success'], "Rider should be edited properly.");

        $videoTag = $videoTagsTable->get($tagId);
        $this->assertNotEquals($videoTagOrigin->begin, $videoTag->begin);
        $this->assertNotEquals($videoTagOrigin->end, $videoTag->end);
        $this->assertNotEquals($videoTagOrigin->tag_id, $videoTag->tag_id);
        $this->assertNotEquals($videoTagOrigin->rider_id, $videoTag->rider_id);
        
        $this->assertEquals($videoTagOrigin->video_id, $videoTag->video_id);
        $this->assertEquals($videoTagOrigin->user_id, $videoTag->user_id);
        $this->assertEquals($videoTagOrigin->created, $videoTag->created);
        $this->assertEquals($videoTagOrigin->count_points, $videoTag->count_points);
        $this->assertEquals($videoTagOrigin->status, $videoTag->status);
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testEditInvalidTag() {
        $this->logUser();
        $riderId = 1;
        $tagId = 983928382;
        $data = [
            'rider_id' => $riderId,
        ];
        $this->post('/api/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResponseError(404);
    }

    
    /**
     * TODO NEW TEST
     */
    public function testEditNotOwner() {
        $tagId = \App\Test\Fixture\VideoTagsFixture::ID_PENDING;
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTagOrigin = $videoTagsTable->get($tagId);
        
        $this->logUser($videoTagOrigin->user_id + 1);
        $data = [
            'begin' => $videoTagOrigin->begin + 1,
            'end' => $videoTagOrigin->end + 1,
        ];
        $this->post('/api/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResponseError(404, "The user should not be able to edit "
                . "another user video tag.");
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
        $this->post('/api/VideoTags/add.json', $data);

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
        $this->post('/api/VideoTags/add.json', $data);
        $result = json_decode($this->_response->body());
//        debug($result);
        $this->assertFalse($result->success);
        $this->assertNotEmpty($result->validationErrors->VideoTags->end);
    }

}
