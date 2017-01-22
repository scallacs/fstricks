<?php

namespace App\Test\Util;

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
    protected function logAdmin($id = 1) {
        // Set session data
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => $id,
                    'username' => 'testing' . $id,
                    'role' => 'admin'
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
        $this->assertResponseOk();
        if ($result === null){
            $result = $this->bodyAsJson();
        }
        $this->assertArrayHasKey('success', $result, $message);
        $this->assertTrue($result['success'], $message);
    }
    public function assertResultMessageFailure($result = null, $message = null){
        $this->assertResponseOk();
        if ($result === null){
            $result = json_decode($this->_response->body(), true);
        }
        $this->assertArrayHasKey('success', $result, $message);
        $this->assertFalse($result['success'], $message);
    }
    public function assertValidationErrors($model, $fields, $result = null, $message = null){
        $this->assertResultMessageFailure($result);
        if ($result === null){
            $result = json_decode($this->_response->body(), true);
        }
        $this->assertArrayHasKeys(['validationErrors' => [$model => $fields]], $result, $message);
    }
    
    public function bodyAsJson($toArray = true){
        return json_decode($this->_response->body(), $toArray);
    }

    public function assertCollection($data, $expectedFields = [], $minRes = false, $maxRes = false) {
        $this->assertTrue(is_array($data), "Data must be an array. Found: " . print_r($data, true));
        if (count($data) > 0) {
            $this->assertArrayHasKeys($expectedFields, $data[0]);
        }
        if ($minRes !== false) {
            $this->assertGreaterThanOrEqual($minRes, count($data));
        }
        if ($maxRes !== false) {
            $this->assertLessThanOrEqual($maxRes, count($data));
        }
    }

    public function assertPaginationResult($message = "Should be a pagination result") {
        $result = $this->bodyAsJson();
        $this->assertArrayHasKeys(['items', 'perPage', 'total'], $result, $message);
        return $result;
    }
}
