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

    const VALID_YOUTUBE_ID = '23490dZJI23';
    const VALID_VIMEO_ID = '97762449';
    
    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'video_url' => self::VALID_YOUTUBE_ID,
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
        [
            'id' => 3,
            'video_url' => self::VALID_VIMEO_ID,
            'provider_id' => 'vimeo',
            'count_tags' => 1,
            'user_id' => 1,
            'created' => 1451060139,
            'status' => \App\Model\Entity\Video::STATUS_PUBLIC
        ],
    ];
}