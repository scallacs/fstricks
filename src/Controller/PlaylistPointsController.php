<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * PlaylistPoints Controller
 *
 * @property \App\Model\Table\PlaylistPointsTable $PlaylistPoints
 */
class PlaylistPointsController extends AppController
{


    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function up($id = null)
    {
        $this->add($id, 1);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function down($id = null)
    {
        $this->add($id, -1);
    }
    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    private function add($id, $value)
    {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $playlistPoint = $this->PlaylistPoints->newEntity();
            $playlistPoint->user_id = $this->Auth->user('id');
            $playlistPoint->playlist_id = $id;
            $playlistPoint->value = $value;
            
            if ($this->PlaylistPoints->save($playlistPoint)) {
                ResultMessage::setMessage(__('Points saved!'), true);
            } else {
                ResultMessage::setMessage(__('Could not save points. Please, try again.'), false);
            }
        }
    }
}
