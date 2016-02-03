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
            'firstname' => 'Stephane',
            'lastname' => 'Leonard',
            'picture' => null,
            'user_id' => 1,
            'is_pro' => false,
            'slug' =>'stephane-leonard'
        ],
        [
            'id' => 2,
            'firstname' => 'Test',
            'lastname' => 'Test2',
            'picture' => null,
            'user_id' => 2,
            'is_pro' => false,
            'slug' =>'test-test2'
        ],
    ];
}
