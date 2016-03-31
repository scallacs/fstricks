<?php

namespace App\Test\TestCase\Model\Table;

use App\Model\Table\VideoTagsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\VideoTagsTable Test Case
 */
class VideoTagsTableTest extends TestCase {

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.users',
        'app.video_providers',
        'app.videos',
        'app.tags',
        'app.video_tags',
        'app.riders',
        'app.sports',
        'app.categories',
        'app.video_tag_accuracy_rates'
    ];


    private function assertEntityHasErrors($entity, $errors, $message = null) {
        foreach ($errors as $name) {
            $this->assertArrayHasKey($name, $entity->errors(), $message);
        }
    }

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        $config = TableRegistry::exists('VideoTags') ? [] : ['className' => 'App\Model\Table\VideoTagsTable'];
        $this->VideoTags = TableRegistry::get('VideoTags', $config);
        $config = TableRegistry::exists('Tags') ? [] : ['className' => 'App\Model\Table\TagsTable'];
        $this->Tags = TableRegistry::get('Tags', $config);
        $config = TableRegistry::exists('Videos') ? [] : ['className' => 'App\Model\Table\VideosTable'];
        $this->Videos = TableRegistry::get('Videos', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown() {
        unset($this->VideoTags);
        unset($this->Videos);
        unset($this->Tags);

        parent::tearDown();
    }

    /**
     * Test adding a similar tag 
     */
    public function testAddTag() {
        // Add a video:
        $data = [
            'tag_id' => 1,
            'video_id' => 1,
            'begin' => 20,
            'end' => 25
        ];
        $videoTag = $this->VideoTags->newEntity($data);
        $videoTag->user_id = 1;
        $this->assertTrue((bool) $this->VideoTags->save($videoTag));
        $this->assertEquals($videoTag->status, \App\Model\Entity\VideoTag::STATUS_PENDING, "It should have the status 'pending'");
    }

    public function testAddWithNewTag() {
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
        $entity = $this->VideoTags->saveWithTag(null, 1, $data);
        $this->assertTrue((bool) $this->VideoTags->save($entity), "Should be possible to add the new tag");
        $entity = $this->VideoTags->saveWithTag(null, 1, $data);
        $this->assertTrue((bool) $this->VideoTags->save($entity), "Should be possible to add a trick with data has a new tag even if tag already exists");
    }

    public function testEditWithNewTag() {
        $videoTag = $this->VideoTags->get(1);
        $data = [
            'tag' => [
                'sport_id' => 1,
                'category_id' => 1,
                'name' => 'testtesghttesttest'
            ],
            'begin' => 2,
            'end' => 10
        ];
        $entity = $this->VideoTags->saveWithTag($videoTag, 1, $data);
        $this->assertTrue((bool) $this->VideoTags->save($entity), "Should be possible to add the new tag");
    }

    /**
     * When adding a tag where there is alreadu a validated tag, it should 
     * be categorized as duplicate immediately
     */
    public function testAddOnValidatedTag() {
        $id = \App\Test\Fixture\VideoTagsFixture::ID_VALIDATED;
        $videoTag = $this->VideoTags->get($id);

        // Creating a new tag
        $videoTagNew = $this->VideoTags->newEntity([
            'tag_id' => $videoTag->tag_id,
            'video_id' => $videoTag->video_id,
            'begin' => $videoTag->begin,
            'end' => $videoTag->end,
        ]);
        $videoTagNew->user_id = 1;
        $this->assertTrue((bool) $this->VideoTags->save($videoTagNew), "Should be possible to create a new tag at the same "
                . "place as a validated tag");
        $this->assertEquals($videoTagNew->status, \App\Model\Entity\VideoTag::STATUS_DUPLICATE, "It should have the status 'duplicate' because their is already a validated tag here");
    }

    /**
     * When adding a tag where there is alreadu a validated tag, it should 
     * be categorized as duplicate immediately
     * TODO
     */
    public function testEditTagRejected() {
        $id = \App\Test\Fixture\VideoTagsFixture::ID_REJECTED;
        $videoTag = $this->VideoTags->get($id);

        $videoTag->begin = $videoTag->begin + 1;
        $this->assertEquals($videoTag->status, \App\Model\Entity\VideoTag::STATUS_REJECTED, "Fixure is not properly set. It should have the status 'rejected'");
        $this->assertTrue((bool) $this->VideoTags->save($videoTag), "Should be possible to edit the tag");
        $this->assertEquals($videoTag->status, \App\Model\Entity\VideoTag::STATUS_REJECTED, "It should have the status 'pending' when saving tag");
    }

    /**
     * 
     */
    public function testInvalidTimeRange() {
        $video = $this->Videos->get(1);
        // Add a video:
        $data = [
            [
                'data' => [
                    'tag_id' => $video->id,
                    'video_id' => 1,
                    'begin' => 20,
                    'end' => 20.5,
                ],
                'validationErrors' => ['end'],
                'message' => "Should not be possible to add a too small range"
            ],
            [
                'data' => [
                    'tag_id' => $video->id,
                    'video_id' => 1,
                    'begin' => 0,
                    'end' => 99,
                ],
                'validationErrors' => ['end'],
                'message' => "Time range should have a max"
            ],
            [
                'data' => [
                    'tag_id' => $video->id,
                    'video_id' => 1,
                    'begin' => -10,
                    'end' => -6,
                ],
                'validationErrors' => ['end', 'begin'],
                'message' => "Time range should not be negative"
            ],
            [
                'data' => [
                    'tag_id' => $video->id,
                    'video_id' => 1,
                    'begin' => 10.2,
                    'end' => 6.5,
                ],
                'validationErrors' => ['end'],
                'message' => "Begin time should be greater than end time"
            ],
            [
                'data' => [
                    'tag_id' => $video->id,
                    'video_id' => 1,
                    'begin' => "Salut",
                    'end' => "blob",
                ],
                'validationErrors' => ['begin', 'end'],
                'message' => "Time range should be positive numbers"
            ],
            [
                'data' => [
                    'tag_id' => $video->id,
                    'video_id' => 1,
                    'begin' => $video->duration - 1,
                    'end' => $video->duration + 3,
                ],
                'validationErrors' => ['end'],
                'message' => "Should not be possible to have an end time greated than the video duration"
            ]
        ];

        foreach ($data as $d) {
            $videoTag = $this->VideoTags->newEntity($d['data']);
            $videoTag->user_id = 1;
            $saved = $this->VideoTags->save($videoTag);
            $this->assertFalse((bool) $saved, $d['message']);
            $this->assertEntityHasErrors($videoTag, $d['validationErrors'], $d['message']);
        }
    }

}
