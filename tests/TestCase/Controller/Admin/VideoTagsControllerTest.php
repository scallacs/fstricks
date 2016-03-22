<?php

namespace App\Test\TestCase\Controller\Admin;
use App\Test\Fixture\VideoTagsFixture;
use App\Test\TestCase\Controller\MyIntegrationTestCase;

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
        'app.video_tag_accuracy_rates',
        'app.sports'
    ];

    /**
     * TODO NEW TEST
     */
    public function testEdit() {
        $tagId = \App\Test\Fixture\VideoTagsFixture::ID_PENDING;
        $videoTagsTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTagOrigin = $videoTagsTable->get($tagId);
        
        $this->logUser($videoTagOrigin->user_id + 1);
        $data = [
            'begin' => $videoTagOrigin->begin + 1,
            'end' => $videoTagOrigin->end + 1,
            'tag' => [
                'name' => 'testnewtag',
                'category_id' => 1,
                'sport_id' => 1
            ],
        ];
        $this->post('/adming/api/VideoTags/edit/' . $tagId . '.json', $data);
        $this->assertResultMessageSuccess();
    }
    
}
