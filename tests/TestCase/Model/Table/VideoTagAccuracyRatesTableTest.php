<?php

namespace App\Test\TestCase\Model\Table;

use App\Model\Table\VideoTagAccuracyRatesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;
use Cake\Core\Configure;
use App\Model\Entity\VideoTagAccuracyRate;
use App\Model\Entity\VideoTag;
/**
 * App\Model\Table\VideoTagAccuracyRatesTable Test Case
 */
class VideoTagAccuracyRatesTableTest extends TestCase {

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_tag_accuracy_rates',
        'app.users',
        'app.tags',
        'app.video_tags',
        'app.videos',
        'app.riders',
        'app.categories',
        'app.sports',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp() {
        parent::setUp();
        $config = TableRegistry::exists('VideoTagAccuracyRates') ? [] : ['className' => 'App\Model\Table\VideoTagAccuracyRatesTable'];
        $this->VideoTagAccuracyRates = TableRegistry::get('VideoTagAccuracyRates', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown() {
        unset($this->VideoTagAccuracyRates);

        parent::tearDown();
    }

    /**
     * 
Configure::write('VideoTagValidation', [
    "threshold_reject" => 0.3,
    "threshold_accept" => 0.3,
    "min_rate" => 0.3
]);
     * Test validationDefault method
     *
     * @return void
     */
    public function testSaveChangeStatusValidated() {
        // Modifiy the video tag:
        $videoTagTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTag = $videoTagTable->get(\App\Test\Fixture\VideoTagsFixture::ID_PENDING);
        $videoTag->count_fake = 0;
        $videoTag->count_accurate = Configure::read('VideoTagValidation.min_rate') - 1;
        $this->assertTrue((bool) $videoTagTable->save($videoTag));
        $entity = $this->VideoTagAccuracyRates->newEntity([
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_PENDING
        ]);
        $entity->user_id = 2;
        $entity->value = VideoTagAccuracyRate::VALUE_ACCURATE;
        $rate = $this->VideoTagAccuracyRates->save($entity, ['checkExisting' => false]);
        $this->assertTrue((bool) $rate, "You should be able to rate a video tag that has a pending status");
        
        $videoTag = $videoTagTable->get(\App\Test\Fixture\VideoTagsFixture::ID_PENDING);
        $this->assertEquals(VideoTag::STATUS_VALIDATED, $videoTag->status, "It should be transform to a valid tag");
    }

    /**
     * 
     * @return void
     */
    public function testSaveChangeStatusRejected() {
        // Modifiy the video tag:
        $videoTagTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTag = $videoTagTable->get(\App\Test\Fixture\VideoTagsFixture::ID_PENDING);
        $videoTag->count_fake = Configure::read('VideoTagValidation.min_rate') - 1;
        $videoTag->count_accurate = 0;
        $this->assertTrue((bool) $videoTagTable->save($videoTag));
        $entity = $this->VideoTagAccuracyRates->newEntity([
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_PENDING
        ]);
        $entity->user_id = 2;
        $entity->value = VideoTagAccuracyRate::VALUE_FAKE;
        $rate = $this->VideoTagAccuracyRates->save($entity, ['checkExisting' => false]);
        $this->assertTrue((bool) $rate, "You should be able to rate a video tag that has a pending status");
        
        $videoTag = $videoTagTable->get(\App\Test\Fixture\VideoTagsFixture::ID_PENDING);
        $this->assertEquals(VideoTag::STATUS_REJECTED, $videoTag->status, "It should be transform to a rejected tag");
    }
    
    
    /**
     * 
     * @return void
     */
    public function testSaveChangeNotStatusChanged() {
        // Modifiy the video tag:
        $videoTagTable = \Cake\ORM\TableRegistry::get('VideoTags');
        $videoTag = $videoTagTable->get(\App\Test\Fixture\VideoTagsFixture::ID_PENDING);
        $videoTag->count_fake = Configure::read('VideoTagValidation.min_rate') - 2;
        $videoTag->count_accurate = 0;
        $this->assertTrue((bool) $videoTagTable->save($videoTag));
        $entity = $this->VideoTagAccuracyRates->newEntity([
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_PENDING
        ]);
        $entity->user_id = 2;
        $entity->value = VideoTagAccuracyRate::VALUE_FAKE;
        $rate = $this->VideoTagAccuracyRates->save($entity, ['checkExisting' => false]);
        $this->assertTrue((bool) $rate, "You should be able to rate a video tag that has a pending status");
        $videoTag = $videoTagTable->get(\App\Test\Fixture\VideoTagsFixture::ID_PENDING);
        $this->assertEquals(VideoTag::STATUS_PENDING, $videoTag->status, "It should be transform to a rejected tag");
    }
    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testSaveOnValidateVideoTag() {
        $entity = $this->VideoTagAccuracyRates->newEntity([
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_VALIDATED
        ]);
        $entity->user_id = 2;
        $entity->value = VideoTagAccuracyRate::VALUE_ACCURATE;
        $videoTag = $this->VideoTagAccuracyRates->save($entity, ['checkExisting' => false]);
        $this->assertFalse((bool) $videoTag, "You should not be able to rate a video tag that has not a pending status");
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testSaveOnPendingVideoTag() {
        $entity = $this->VideoTagAccuracyRates->newEntity([
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_PENDING,
        ]);
        $entity->user_id = 2;
        $entity->value = VideoTagAccuracyRate::VALUE_ACCURATE;
        $videoTag = $this->VideoTagAccuracyRates->save($entity, ['checkExisting' => false]);
        $this->assertTrue((bool) $videoTag, "You should be able to rate a video tag that has a pending status");
    }

}
