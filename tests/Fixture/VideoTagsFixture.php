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
    
    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => VideoTagsFixture::ID_VALIDATED,
            'video_id' => 1,
            'tag_id' => 1,
            'user_id' => 1,
            'begin' => 23,
            'end' => 32,
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
            'begin' => 33,
            'end' => 35,
            'created' => 1451080432,
            'count_points' => 1,
            'count_report_errors' => 0,
            'status' => VideoTag::STATUS_PENDING
        ]
    ];

}
