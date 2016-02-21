<?php

namespace App\Test\TestCase\Controller;

use App\Controller\VideoTagAccuracyRatesController;

/**
 * App\Controller\VideoTagAccuracyRatesController Test Case
 */
class VideoTagAccuracyRatesControllerTest extends MyIntegrationTestCase {

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.video_tag_accuracy_rates',
        'app.users',
        'app.tags',
        'app.video_tags',
        'app.videos',
        'app.riders',
        'app.categories',
        'app.sports',
    ];

    private function find($videoTagId, $userId) {
        $table = \Cake\ORM\TableRegistry::get('VideoTagAccuracyRates');
        return $table->find('all')
                        ->where(['user_id' => $userId, 'video_tag_id' => $videoTagId]);
    }

    /**
     * Test view method
     *
     * @return void
     */
    public function testDuplicateRate() {
        $data = [
            'video_tag_id' => 1
        ];
        $this->logUser(1);
//        debug($this->find(1, 1)->first());
        $exists = $this->find(1, 1)->count() === 1;
        $this->assertTrue($exists, "Fixtures are not properly sets");

        $this->post('/VideoTagAccuracyRates/fake.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
//        debug($this->find(1, 1)->first());

        $this->assertFalse($result['success']);
    }

    /**
     * Test view method
     *
     * @return void
     */
    public function testFake() {
        $data = [
            'video_tag_id' => 1
        ];
        $this->logUser(2);

        $this->post('/VideoTagAccuracyRates/fake.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
    }

    /**
     * Test view method
     *
     * @return void
     */
    public function testAccurate() {
        $data = [
            'video_tag_id' => 1
        ];
        $this->logUser(2);

        $this->post('/VideoTagAccuracyRates/accurate.json', $data);
        $this->assertResponseOk();
        $result = json_decode($this->_response->body(), true);
        $this->assertTrue($result['success']);
    }

}
