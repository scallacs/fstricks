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
    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'title' => 'Lorem ipsum dolor sit amet',
            'description' => 'Lorem ipsum dolor sit amet',
            'created' => 1456577224,
            'modified' => 1456577224,
            'user_id' => 1,
            'status' => 'public',
            'count_points' => 1,
            'count_tags' => 0
        ],
    ];
}
