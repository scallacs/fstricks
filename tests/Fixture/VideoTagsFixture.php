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

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
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
    ];

}
