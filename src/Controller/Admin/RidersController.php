<?php
namespace App\Controller;

use App\Controller\AppController;

/**
 * Riders Controller
 *
 * @property \App\Model\Table\RidersTable $Riders
 */
class RidersController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $this->paginate = [
            'contain' => ['Users', 'SocialProviders']
        ];
        $this->set('riders', $this->paginate($this->Riders));
        $this->set('_serialize', ['riders']);
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
            'contain' => ['Users', 'SocialProviders', 'VideoTags']
        ]);
        $this->set('rider', $rider);
        $this->set('_serialize', ['rider']);
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
                $this->Flash->success(__('The rider has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The rider could not be saved. Please, try again.'));
            }
        }
        $users = $this->Riders->Users->find('list', ['limit' => 200]);
        $socialProviders = $this->Riders->SocialProviders->find('list', ['limit' => 200]);
        $this->set(compact('rider', 'users', 'socialProviders'));
        $this->set('_serialize', ['rider']);
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
                $this->Flash->success(__('The rider has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The rider could not be saved. Please, try again.'));
            }
        }
        $users = $this->Riders->Users->find('list', ['limit' => 200]);
        $socialProviders = $this->Riders->SocialProviders->find('list', ['limit' => 200]);
        $this->set(compact('rider', 'users', 'socialProviders'));
        $this->set('_serialize', ['rider']);
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
            $this->Flash->success(__('The rider has been deleted.'));
        } else {
            $this->Flash->error(__('The rider could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}
