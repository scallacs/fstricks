<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * VideosFixture
 *
 */
class VideosFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $import = ['table' => 'videos', 'connection' => 'default'];

    // @codingStandardsIgnoreEnd

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'video_url' => '23490dZJI23',
            'provider_id' => 'youtube',
            'count_tags' => 1,
            'user_id' => 1,
            'created' => 1451060139,
            'status' => \App\Model\Entity\Video::STATUS_PUBLIC
        ],
        [
            'id' => 2,
            'video_url' => 'myfakevideourl',
            'provider_id' => 'youtube',
            'count_tags' => 1,
            'user_id' => 1,
            'created' => 1451060139,
            'status' => \App\Model\Entity\Video::STATUS_PUBLIC
        ],
    ];
}