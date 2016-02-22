<?php
namespace App\Test\TestCase\Controller;

class MyIntegrationTestCase extends \Cake\TestSuite\IntegrationTestCase{
    
    protected function logUser($id = 1) {
        // Set session data
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => $id,
                    'username' => 'testing'.$id,
                ]
            ]
        ]);
    }
    
    
    public function setUp(){
        parent::setUp();
        \App\Lib\ResultMessage::reset();
    }
    public function tearDown() {
        parent::tearDown();
        \App\Lib\ResultMessage::reset();
    }
    

}