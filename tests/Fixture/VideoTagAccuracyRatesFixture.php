<?php

namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * VideoTagAccuracyRatesFixture
 *
 */
class VideoTagAccuracyRatesFixture extends TestFixture {

    public $import = ['table' => 'video_tag_accuracy_rates', 'connection' => 'default'];

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'user_id' => 1,
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_VALIDATED, // Must be a video tag with validated status
            'value' => 'accurate'
        ],
        [
            'user_id' => 1,
            'video_tag_id' => \App\Test\Fixture\VideoTagsFixture::ID_PENDING, // Must be a video tag with pending status
            'value' => 'accurate'
        ]
    ];

}
