<?php
namespace App\Controller;
use App\Lib\ResultMessage;
use App\Controller\AppController;

/**
 * Feedbacks Controller
 *
 * @property \App\Model\Table\FeedbacksTable $Feedbacks
 */
class FeedbacksController extends AppController
{

    
    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
    }

    /**
     * Add method
     *
     */
    public function send()
    {
        $feedback = $this->Feedbacks->newEntity();
        if ($this->request->is('post') && !empty($this->request->data['feedback'])) {
            $data = json_decode($this->request->data['feedback'], true);
            $feedback = $this->Feedbacks->patchEntity($feedback, $data);
            $feedback->user_id = $this->Auth->user('id');
            if ($this->Feedbacks->save($feedback)) {
                ResultMessage::setMessage(__('The feedback has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The feedback could not be saved. Please, try again.'), false);
            }
        }
    }

}
