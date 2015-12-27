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
    public function up()
    {
        $this->add(1);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function down()
    {
        $this->add(-1);
    }
    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    private function add($value)
    {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $videoTagPoint = $this->VideoTagPoints->newEntity($this->request->data);
            $videoTagPoint->user_id = $this->Auth->user('id');
            $videoTagPoint->value = $value;
            
            if ($this->VideoTagPoints->save($videoTagPoint)) {
                ResultMessage::setMessage(__('The video tag point has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The video tag point could not be saved. Please, try again.'), false);
            }
        }
    }
}
