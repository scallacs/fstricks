<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * TagsFixture
 *
 */
class TagsFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $import = ['table' => 'tags', 'connection' => 'default'];

    // @codingStandardsIgnoreEnd

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'name' => 'Frontside 360',
            'count_ref' => 1,
            'category_id' => null,
            'user_id' => null,
            'created' => 10000,
            'slug' => 'frontside-360'
        ],
        [
            'id' => 2,
            'name' => 'Backside 360',
            'count_ref' => 1,
            'created' => 10000,
            'slug' => 'backside-360'
        ]
    ];
}
