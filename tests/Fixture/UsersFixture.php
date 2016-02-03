<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * UsersFixture
 *
 */
class UsersFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $import = ['table' => 'users', 'connection' => 'default'];
    
    // @codingStandardsIgnoreEnd

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'email' => 'sca.leonard@gmail.com',
            'username' => 'scallacs'
        ],
        [
            'id' => 2,
            'email' => 'sca.leonard2@gmail.com',
            'username' => 'scallacs2'
        ],
    ];
}
