<?php

namespace App\Test\TestCase\Controller\Admin;
use App\Test\Fixture\VideoTagsFixture;

/**
 * App\Controller\VideoTagsController Test Case
 */
class VideoTagsControllerTest extends \App\Test\Util\MyIntegrationTestCase {

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
        
        $this->logAdmin();
        
        $data = [
            'user_id' => 1,
            'video_id' => 1,
            'begin' => $videoTagOrigin->begin + 1,
            'end' => $videoTagOrigin->end + 1,
            'tag' => [
                'name' => 'testnewtag',
                'category_id' => 1
            ],
        ];
        $this->put('/admin/api/video-tags/edit/' . $tagId, $data);
        $this->assertResultMessageSuccess();
    }
    
}
