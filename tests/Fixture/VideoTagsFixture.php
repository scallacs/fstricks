<?php

namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;
use App\Model\Entity\VideoTag;

/**
 * VideoTagsFixture
 *
 */
class VideoTagsFixture extends TestFixture {

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $import = ['table' => 'video_tags', 'connection' => 'default'];

    // @codingStandardsIgnoreEnd

    const ID_VALIDATED = 1;
    const ID_PENDING = 2;
    const ID_REJECTED = 3;
    const ID_ONE_MORE_TO_REJECT = 4;
    const ID_ONE_MORE_TO_VALIDATE = 5;
    const ID_TWO_MORE_TO_VALIDATE = 6;

    public function init() {
        $this->records = [
            [
                'id' => VideoTagsFixture::ID_VALIDATED,
                'video_id' => 1,
                'tag_id' => 1,
                'user_id' => 1,
                'begin' => 0,
                'rider_id' => 1,
                'end' => 5,
                'created' => 1451080432,
                'count_points' => 1,
                'count_report_errors' => 0,
                'status' => VideoTag::STATUS_VALIDATED
            ],
            [
                'id' => VideoTagsFixture::ID_PENDING,
                'video_id' => 1,
                'tag_id' => 1,
                'user_id' => 1,
                'begin' => 5,
                'end' => 10,
                'created' => 1451080432,
                'count_points' => 1,
                'count_report_errors' => 0,
                'status' => VideoTag::STATUS_PENDING
            ],
            [
                'id' => VideoTagsFixture::ID_REJECTED,
                'video_id' => 1,
                'tag_id' => 1,
                'user_id' => 1,
                'begin' => 10,
                'end' => 15,
                'created' => 1451080432,
                'count_points' => 1,
                'count_report_errors' => 0,
                'status' => VideoTag::STATUS_REJECTED
            ],
            [
                'id' => VideoTagsFixture::ID_ONE_MORE_TO_REJECT,
                'video_id' => 1,
                'tag_id' => 1,
                'user_id' => 1,
                'begin' => 20,
                'end' => 25,
                'created' => 1451080432,
                'count_points' => 1,
                'count_report_errors' => 0,
                'status' => VideoTag::STATUS_PENDING,
                'count_fake' => \Cake\Core\Configure::read('VideoTagValidation.min_rate') - 1
            ],
            [
                'id' => VideoTagsFixture::ID_ONE_MORE_TO_VALIDATE,
                'video_id' => 1,
                'tag_id' => 1,
                'user_id' => 1,
                'begin' => 25,
                'end' => 30,
                'created' => 1451080432,
                'count_points' => 1,
                'count_report_errors' => 0,
                'status' => VideoTag::STATUS_PENDING,
                'count_accurate' => \Cake\Core\Configure::read('VideoTagValidation.min_rate') - 1
            ],
            [
                'id' => VideoTagsFixture::ID_TWO_MORE_TO_VALIDATE,
                'video_id' => 1,
                'tag_id' => 1,
                'user_id' => 1,
                'begin' => 25,
                'end' => 30,
                'created' => 1451080432,
                'count_points' => 1,
                'count_report_errors' => 0,
                'status' => VideoTag::STATUS_PENDING,
                'count_accurate' => \Cake\Core\Configure::read('VideoTagValidation.min_rate') - 2
            ]
        ];
        parent::init();
    }

}
