<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * RidersFixture
 *
 */
class NationalitiesFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    public $import = ['table' => 'nationalities', 'connection' => 'default'];

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'code' => 'fr',
            'name' => 'France'
        ],
        [
            'code' => 'usa',
            'name' => 'USA'
        ],
    ];
}
