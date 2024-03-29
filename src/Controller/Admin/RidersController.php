<?php
namespace App\Controller\Admin;

use App\Lib\ResultMessage;

/**
 * Riders Controller
 *
 * @property \App\Model\Table\RidersTable $Riders
 */
class RidersController extends AppController
{

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Riders->initFilters('admin');
    }
    

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $query = $this->Riders
                ->find('search', $this->Riders->filterParams($this->request->query));
        ResultMessage::paginate($query, $this);
    }

    /**
     * View method
     *
     * @param string|null $id Rider id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null)
    {
        $rider = $this->Riders->get($id, [
            'contain' => ['Users']
        ]);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($rider);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $rider = $this->Riders->newEntity();
        if ($this->request->is('post')) {
            $rider = $this->Riders->patchEntity($rider, $this->request->data);
            if ($this->Riders->save($rider)) {
                ResultMessage::setMessage(__('The rider has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                ResultMessage::setMessage(__('The rider could not be saved. Please, try again.'));
            }
        }
    }

    /**
     * Edit method
     *
     * @param string|null $id Rider id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $rider = $this->Riders->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $rider = $this->Riders->patchEntity($rider, $this->request->data);
            if ($this->Riders->save($rider)) {
                ResultMessage::setMessage(__('The rider has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                ResultMessage::setMessage(__('The rider could not be saved. Please, try again.'));
            }
        }
    }

    /**
     * Delete method
     *
     * @param string|null $id Rider id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $rider = $this->Riders->get($id);
        if ($this->Riders->delete($rider)) {
            ResultMessage::setMessage(__('The rider has been deleted.'));
        } else {
            ResultMessage::setMessage(__('The rider could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}
