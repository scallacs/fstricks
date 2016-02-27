<?php
namespace App\Test\TestCase\Controller;

use App\Controller\PlaylistsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\PlaylistsController Test Case
 */
class PlaylistsControllerTest extends IntegrationTestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.playlists',
        'app.users',
        'app.tags',
        'app.video_tags',
        'app.videos',
        'app.riders',
        'app.video_tag_accuracy_rates',
        'app.categories',
        'app.sports',
        'app.playlist_video_tags'
    ];

    /**
     * Test index method
     *
     * @return void
     */
    public function testIndex()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test view method
     *
     * @return void
     */
    public function testView()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAdd()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test edit method
     *
     * @return void
     */
    public function testEdit()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test delete method
     *
     * @return void
     */
    public function testDelete()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
