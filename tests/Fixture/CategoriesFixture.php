<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * CategoriesFixture
 *
 */
class CategoriesFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    public $import = ['table' => 'categories', 'connection' => 'default'];

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'name' => 'sport'
        ],
        [
            'id' => 2,
            'name' => 'bar'
        ],
        [
            'id' => 3,
            'name' => 'party'
        ],
        [
            'id' => 4,
            'name' => 'show'
        ],
    ];
}
