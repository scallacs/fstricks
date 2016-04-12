<?php
namespace App\Controller\Admin;
use App\Lib\ResultMessage;


/**
 * Feedbacks Controller
 *
 * @property \App\Model\Table\FeedbacksTable $Feedbacks
 */
class FeedbacksController extends AppController
{

    public function index() {
        $query = $this->Feedbacks->find('all')
                ->contain([
                    'Users', 
                ]);
        ResultMessage::paginate($query, $this);
    }
    
    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $feedback = $this->Feedbacks->get($id, [
            'contain' => [
                'Users'
            ]
        ]);
        ResultMessage::overwriteData($feedback);
        ResultMessage::setWrapper(false);
    }
}
