<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * VideoTagPointsFixture
 *
 */
class VideoTagPointsFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'value' => ['type' => 'string', 'length' => 45, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'users_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'video_tag_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        '_indexes' => [
            'fk_video_tag_points_users1_idx' => ['type' => 'index', 'columns' => ['users_id'], 'length' => []],
            'fk_video_tag_points_video_tags1_idx' => ['type' => 'index', 'columns' => ['video_tag_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'users_id_UNIQUE' => ['type' => 'unique', 'columns' => ['users_id'], 'length' => []],
            'video_tag_id_UNIQUE' => ['type' => 'unique', 'columns' => ['video_tag_id'], 'length' => []],
            'fk_video_tag_points_users1' => ['type' => 'foreign', 'columns' => ['users_id'], 'references' => ['users', 'id'], 'update' => 'cascade', 'delete' => 'cascade', 'length' => []],
            'fk_video_tag_points_video_tags1' => ['type' => 'foreign', 'columns' => ['video_tag_id'], 'references' => ['video_tags', 'id'], 'update' => 'cascade', 'delete' => 'cascade', 'length' => []],
        ],
        '_options' => [
            'engine' => 'InnoDB',
            'collation' => 'utf8_general_ci'
        ],
    ];
    // @codingStandardsIgnoreEnd

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'value' => 'Lorem ipsum dolor sit amet',
            'users_id' => 1,
            'video_tag_id' => 1
        ],
    ];
}
