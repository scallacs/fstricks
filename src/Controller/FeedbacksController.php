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

    

    /**
     * TODO
     * Add method
     *
     */
    public function send()
    {
        $feedback = $this->Feedbacks->newEntity();
        if ($this->request->is('post')) {
            $feedback = $this->Feedbacks->patchEntity($feedback, $this->request->data);
            $feedback->user_id = $this->Auth->user('id');
            if ($this->Feedbacks->save($feedback)) {
                ResultMessage::setMessage(__('The feedback has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The feedback could not be saved. Please, try again.'), false);
            }
        }
    }

}
