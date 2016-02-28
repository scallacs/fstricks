<?php

namespace App\Test\TestCase\Controller;

class MyIntegrationTestCase extends \Cake\TestSuite\IntegrationTestCase {

    protected function logUser($id = 1) {
        // Set session data
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => $id,
                    'username' => 'testing' . $id,
                ]
            ]
        ]);
    }

    public function setUp() {
        parent::setUp();
        \App\Lib\ResultMessage::reset();
    }

    public function tearDown() {
        parent::tearDown();
        \App\Lib\ResultMessage::reset();
    }

    public function assertArrayHasKeys($keys, $array, $message = null) {
        foreach ($keys as $key => $keyOrArray) {
            if (is_array($keyOrArray)) {
                $this->assertArrayHasKey($key, $array, $message);
                $this->assertArrayHasKeys($keyOrArray, $array[$key], $message);
            } else {
                $this->assertArrayHasKey($keyOrArray, $array, $message);
            }
        }
    }
    
    public function assertResultMessageSuccess($result = null, $message = null){
        if ($result === null){
            $result = json_decode($this->_response->body(), true);
        }
        $this->assertArrayHasKey('success', $result, $message);
        $this->assertTrue($result['success'], $message);
    }
    public function assertResultMessageFailure($result = null, $message = null){
        if ($result === null){
            $result = json_decode($this->_response->body(), true);
        }
        $this->assertArrayHasKey('success', $result, $message);
        $this->assertFalse($result['success'], $message);
    }

}
