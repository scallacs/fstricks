<?php

namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * UsersFixture
 *
 */
class UsersFixture extends TestFixture {

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $import = ['table' => 'users', 'connection' => 'default'];
    // @codingStandardsIgnoreEnd

    public static $RECORD_RESET_PASSWORD = [
        'id' => 4,
        'email' => 'testmailtesttest@mail.com',
        'username' => 'usertestpassword',
    ];

    public function init() {
        $this->records = [
            [
                'id' => 1,
                'email' => 'sca.leonard@gmail.com',
                'username' => 'scallacs',
            ],
            [
                'id' => 2,
                'email' => 'sca.leonard2@gmail.com',
                'username' => 'scallacs2'
            ],
            [
                'id' => 3,
                'email' => 'sca.leonard3@gmail.com',
                'username' => 'scallacs3'
            ],
            self::$RECORD_RESET_PASSWORD
        ];
        parent::init();
    }

}
