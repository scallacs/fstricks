<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * VideoTagPoints Controller
 *
 * @property \App\Model\Table\VideoTagPointsTable $VideoTagPoints
 */
class VideoTagPointsController extends AppController
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
            $videoTagPoint = $this->VideoTagPoints->newEntity();
            $videoTagPoint->video_tag_id = $id;
            $videoTagPoint->user_id = $this->Auth->user('id');
            $videoTagPoint->value = $value;
            
            if ($this->VideoTagPoints->save($videoTagPoint)) {
                ResultMessage::setMessage(__('Points saved!'), true);
            } else {
                ResultMessage::setMessage(__('Could not save points. Please, try again.'), false);
            }
        }
    }
}
