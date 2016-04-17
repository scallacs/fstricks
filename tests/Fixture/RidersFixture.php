<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * RidersFixture
 *
 */
class RidersFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    public $import = ['table' => 'riders', 'connection' => 'default'];

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'firstname' => 'Stéphane',
            'lastname' => 'Leonard',
            'picture' => null,
            'user_id' => 1,
            'level' => 1,
            'slug' => 'stephane-leonard'
        ],
        [
            'id' => 2,
            'firstname' => 'Test',
            'lastname' => 'Test2',
            'picture' => 1,
            'user_id' => 2,
            'level' => false,
            'slug' =>'test-test2'
        ],
        [
            'id' => 3,
            'firstname' => 'xavier',
            'lastname' => 'de le rue',
            'picture' => null,
            'user_id' => null,
            'level' => 1,
            'slug' =>'xavier-de-le-rue-fr'
        ],
    ];
}
