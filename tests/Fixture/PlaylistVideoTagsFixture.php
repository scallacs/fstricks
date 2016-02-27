<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * PlaylistVideoTagsFixture
 *
 */
class PlaylistVideoTagsFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    public $import = ['table' => 'playlist_video_tags', 'connection' => 'default'];

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'playlist_id' => 1,
            'video_tag_id' => 1,
            'position' => 1
        ],
    ];
}
