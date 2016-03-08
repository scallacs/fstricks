<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * PlaylistsFixture
 *
 */
class PlaylistsFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    public $import = ['table' => 'playlists', 'connection' => 'default'];
    
    const ID_PUBLIC = 1;
    const ID_PRIVATE = 2;
    const ID_BLOCKED = 3;
    const SLUG_PUBLIC = 'playlist-public';
    const SLUG_PRIVATE = 'playlist-private';
    const SLUG_BLOCKED = 'playlist-blocked';
    const ID_EMPTY_PLAYLIST = self::ID_PRIVATE;
    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => self::ID_PUBLIC,
            'title' => 'Lorem ipsum dolor sit amet',
            'description' => 'Lorem ipsum dolor sit amet',
            'created' => 1456577224,
            'modified' => 1456577224,
            'user_id' => 1,
            'status' => \App\Model\Entity\Playlist::STATUS_PUBLIC,
            'count_points' => 1,
            'count_tags' => 3,
            'slug' => self::SLUG_PUBLIC
        ],
        [
            'id' => self::ID_PRIVATE,
            'title' => 'Playlist private',
            'description' => 'Lorem ipsum dolor sit amet',
            'created' => 1456577224,
            'modified' => 1456577224,
            'user_id' => 1,
            'status' => \App\Model\Entity\Playlist::STATUS_PRIVATE,
            'count_points' => 1,
            'count_tags' => 0,
            'slug' => self::SLUG_PRIVATE
        ],
        [
            'id' => self::ID_BLOCKED,
            'title' => 'Playlist blocked',
            'description' => 'Lorem ipsum dolor sit amet',
            'created' => 1456577224,
            'modified' => 1456577224,
            'user_id' => 1,
            'status' => \App\Model\Entity\Playlist::STATUS_BLOCKED,
            'count_points' => 1,
            'count_tags' => 0,
            'slug' => self::SLUG_BLOCKED
        ],
    ];
}
