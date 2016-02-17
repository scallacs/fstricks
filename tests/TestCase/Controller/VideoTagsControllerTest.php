<?php

namespace App\Test\TestCase\Controller;

use App\Controller\VideoTagsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\VideoTagsController Test Case
 */
class VideoTagsControllerTest extends MyIntegrationTestCase {

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
//    public function testView() {
//        $id = 1;
//        $this->get("/VideoTags/view/$id.json");
//
//        $this->assertResponseOk();
//        $result = json_decode($this->_response->body());
//    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testSearch() {
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
     * 
     *  - sport_id
     *  - category_id
     *  - tag_id
     *  - video_id
     *  - rider_id
     * - trick_name
     */
    public function testSearchParams() {
        $this->get('/VideoTags/search.json?tag_name=frontside');
        $this->assertResponseOk();
        $this->get('/VideoTags/search.json?rider_id=1');
        $this->assertResponseOk();
        $this->get('/VideoTags/search.json?sport_id=1');
        $this->assertResponseOk();
        $this->get('/VideoTags/search.json?tag_id=1');
        $this->assertResponseOk();
        $this->get('/VideoTags/search.json?trick-slug=frontside-360');
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
     * Test that a user cannot modify the video tag execpt the rider ? 
     *
     * @return void
     */
    public function testEditVideoTag() {
        $this->logUser();
        $riderId = 1;
        $tagId = 1;
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTagOrigin = $videoTagsTable->get($tagId);

        $data = [
            'begin' => $videoTagOrigin->begin + 1,
            'end' => $videoTagOrigin->end + 1,
            'video_id' => $videoTagOrigin->video_id + 1,
            'user_id' => $videoTagOrigin->user_id + 1,
            'tag_id' => $videoTagOrigin->tag_id + 1,
            'count_tags' => 39232,
            'user_id' => $videoTagOrigin->user_id + 1,
            'created' => 2,
            'count_points' => 378293,
            'status' => \App\Model\Entity\VideoTag::STATUS_REJECTED
        ];
        $this->post('/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
//        debug($result);
        $this->assertTrue($result['success'], "Rider should be edited properly.");

        $videoTag = $videoTagsTable->get($tagId);
        $this->assertEquals($videoTagOrigin->begin, $videoTag->begin);
        $this->assertEquals($videoTagOrigin->end, $videoTag->end);
        $this->assertEquals($videoTagOrigin->video_id, $videoTag->video_id);
        $this->assertEquals($videoTagOrigin->tag_id, $videoTag->tag_id);
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
    public function testEditRider() {
        $this->logUser();
        $newRiderId = 2;
        $tagId = 1;
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTagOrigin = $videoTagsTable->get($tagId);
//        debug($videoTagOrigin);
        $data = [
            'rider_id' => $newRiderId,
        ];
        $this->post('/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResponseOk();
        $videoTag = $videoTagsTable->get($tagId);
        $this->assertNotEquals($videoTagOrigin->rider_id, $videoTag->rider_id, "Rider id should not be the same as origin");
        $this->assertEquals($newRiderId, $videoTag->rider_id, "Rider id should be edited for this video tag");

        $result = json_decode($this->_response->body(), true);
//        debug($result);
        $this->assertTrue($result['success'], "Should return a successfull response.");
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
        $this->post('/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResponseError(404);
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
