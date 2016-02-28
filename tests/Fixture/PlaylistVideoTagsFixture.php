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

    const ID_FIRST = 1;
    const ID_MIDDLE = 2;
    const ID_LAST = 3;
    
    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => self::ID_FIRST,
            'playlist_id' => PlaylistsFixture::ID_PUBLIC,
            'video_tag_id' => 1,
            'position' => 1
        ],
        [
            'id' => self::ID_MIDDLE,
            'playlist_id' => PlaylistsFixture::ID_PUBLIC,
            'video_tag_id' => 2,
            'position' => 2
        ],
        [
            'id' => self::ID_LAST,
            'playlist_id' => PlaylistsFixture::ID_PUBLIC,
            'video_tag_id' => 3,
            'position' => 3
        ],
    ];
}
