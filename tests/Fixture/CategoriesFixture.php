<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * SportsFixture
 *
 */
class CategoriesFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $import = ['table' => 'categories', 'connection' => 'default'];

    // @codingStandardsIgnoreEnd

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'sport_id' => 1,
            'name' => 'Kicker',
            'slug' => 'kicker',
            'status' => \App\Model\Entity\Category::STATUS_PUBLIC
        ],
        [
            'id' => 2,
            'sport_id' => 1,
            'name' => 'jib',
            'slug' => 'jib',
            'status' => \App\Model\Entity\Category::STATUS_PUBLIC
        ],
    ];
}
